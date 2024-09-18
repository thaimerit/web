/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from 'react';
import { TextField, Checkbox, FormControlLabel, FormHelperText, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import Button from '../components/button/button';
import Image from 'next/image';
import styles from '../styles/pages/Login.module.scss'
import Containner from '../components/containner';
import LineEnd from '../components/line-end';
import SocialButton from '../components/button/social-button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { getCsrfToken, getSession, useSession } from 'next-auth/react';
import { setup } from '../utils/csrf';
import axios from 'axios';
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { alertOkButtonColor, primary } from '../utils/variable';
import { useRouter } from 'next/router';
import { API } from '../service/apiService';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers";
import Link from 'next/link';
import { errorHandler } from '../utils/alertUtil';

export default function Signup(prop) {

    const { data: session } = useSession()
    const { t } = useTranslation();
    const MySwal = withReactContent(Swal)
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/")
        }
    }, [session])

    if (session) {
        return <div></div>
    }

    const LoginSchema = Yup.object().shape({
        firstName: Yup.string().required(t("required")),
        lastName: Yup.string().required(t("required")),
        email: Yup.string().email(t('invalid_email')).required(t("required")),
        dateOfBirth: Yup.date(t("required")).required(t("required")).nullable(true),
        dateOfBirthType: Yup.string().required(t("required")),
        username: Yup.string().required(t("required")),
        mobilePhone: Yup.string().required(t("required")),
        password: Yup.string().required(t("required")),
        passwordConfirmation: Yup.string().required(t("required"))
            .test('passwords-match', t('passwords_must_match'), function (value) {
                return this.parent.password === value
            }),
        acceptPolicyPrivacy: Yup
            .boolean()
            .oneOf([true], t("required"))
            .required(t("required")),
    });


    return (
        <Containner>
            <LocalizationProvider dateAdapter={AdapterMoment}>
                <div className={'flex justify-center content-center items-center mt-6 ' + styles.loginBoxWrapper}>
                    <div className={'flex-col items-center ' + styles.loginBox}>
                        <Formik
                            initialValues={{
                                firstName: '',
                                lastName: '',
                                username: '',
                                email: '',
                                dateOfBirth: null,
                                dateOfBirthType: '',
                                mobilePhone: '',
                                password: '',
                                passwordConfirmation: '',
                                receiveNewsletter: false,
                                acceptPolicyPrivacy: false,
                            }}
                            validationSchema={LoginSchema}
                            onSubmit={async (values, { setSubmitting }) => {

                                try {
                                    // values.username = values.email

                                    values.dateOfBirth = values.dateOfBirth

                                    let result = await API.register(values)

                                    MySwal.fire({
                                        icon: 'success',
                                        title: t("registerSuccessTitle"),
                                        confirmButtonText: t('OK'),
                                        confirmButtonColor: alertOkButtonColor,
                                    }).then(() => {
                                        // router.push('/login')
                                        router.push('/signup-confirm?email=' + values.email)
                                    })
                                } catch (error) {
                                    setSubmitting(false);
                                    let errorMessage = errorHandler(error);
                                    MySwal.fire({
                                        icon: "error",
                                        title: t("errorTitle"),
                                        text: t(errorMessage),
                                        confirmButtonText: t("OK"),
                                        confirmButtonColor: primary,
                                    });
                                }

                            }}
                        >
                            {({
                                values,
                                errors,
                                touched,
                                handleChange,
                                handleBlur,
                                handleSubmit,
                                isSubmitting,
                                setFieldValue
                                /* and other goodies */
                            }) => (
                                <form onSubmit={handleSubmit} method="post" action="/api/auth/callback/credentials">
                                    {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}

                                    {/* <img src="/images/logo-big.png" className={styles.logo} /> */}

                                    <div className='mt-6'>
                                        <p className="text-xl">ข้อมูลส่วนตัวของฉัน</p>
                                    </div>

                                    {/* <div className='mt-4'>
                                    <TextField className='w-full' label="ชื่อผู้ใช้งาน" variant="outlined" />
                                </div> */}
                                    <div className='mt-4'>
                                        <TextField
                                            className='w-full'
                                            label={<>ชื่อ <span style={{ color: "#F00" }}>*</span></>}
                                            variant="outlined"
                                            name="firstName"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.firstName}
                                            error={errors.firstName && touched.firstName}
                                            helperText={errors.firstName && touched.firstName ? (
                                                errors.firstName
                                            ) : null} />
                                    </div>
                                    <div className='mt-4'>
                                        <TextField
                                            className='w-full'
                                            label={<>สกุล <span style={{ color: "#F00" }}>*</span></>}
                                            variant="outlined"
                                            name="lastName"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.lastName}
                                            error={errors.lastName && touched.lastName}
                                            helperText={errors.lastName && touched.lastName ? (
                                                errors.lastName
                                            ) : null} />
                                    </div>
                                    <div className='mt-4'>
                                        <DesktopDatePicker
                                            label={<>วันเกิด <span style={{ color: "#F00" }}>*</span></>}
                                            type="text"
                                            inputFormat="DD/MM/yyyy"
                                            value={values.dateOfBirth}
                                            name="dateOfBirth"
                                            onChange={value => setFieldValue("dateOfBirth", value)}
                                            renderInput={(params) => <TextField className="w-full" {...params}
                                                error={errors.dateOfBirth && touched.dateOfBirth}
                                                helperText={errors.dateOfBirth && touched.dateOfBirth ? (
                                                    errors.dateOfBirth
                                                ) : null} />}
                                        />
                                    </div>
                                    {
                                        values.dateOfBirth?.format('dddd') === 'Wednesday' || values.dateOfBirth?.format('dddd') === 'พุธ' && <div className='mt-4'>
                                            <FormControl fullWidth>
                                                <InputLabel id="demo-simple-select-label">{<>ช่วงเวลา <span style={{ color: "#F00" }}>*</span></>}</InputLabel>
                                                <Select
                                                labelId="demo-simple-select-label"
                                                id="demo-simple-select"
                                                value={values.dateOfBirthType}
                                                label={<>ช่วงเวลา <span style={{ color: "#F00" }}>*</span></>}
                                                name='dateOfBirthType'

                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                >
                                                    <MenuItem value='day'>กลางวัน</MenuItem>
                                                    <MenuItem value='night'>กลางคืน</MenuItem>
                                                </Select>
                                                <FormHelperText className='mx-8' error={errors.dateOfBirthType && touched.dateOfBirthType}>
                                                    {errors.dateOfBirthType && touched.dateOfBirthType ? (
                                                        errors.dateOfBirthType
                                                    ) : null}
                                                </FormHelperText>
                                            </FormControl>
                                        </div>
                                    }

                                    <div className='mt-4'>
                                        <TextField className='w-full'
                                            label={<>อีเมล <span style={{ color: "#F00" }}>*</span></>}
                                            variant="outlined"
                                            name="email"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.email}
                                            error={errors.email && touched.email}
                                            helperText={errors.email && touched.email ? (
                                                errors.email
                                            ) : null} />
                                    </div>
                                    <div className='mt-4'>
                                        <TextField className='w-full'
                                            label={<>เบอร์โทรศัพท์ <span style={{ color: "#F00" }}>*</span></>}
                                            variant="outlined"
                                            name="mobilePhone"
                                            type="tel"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.mobilePhone}
                                            error={errors.mobilePhone && touched.mobilePhone}
                                            helperText={errors.mobilePhone && touched.mobilePhone ? (
                                                errors.mobilePhone
                                            ) : null} />
                                    </div>
                                    {/* <div className='mt-4'>
                                    <TextField className='w-full' label="เบอร์โทรศัพท์" type="tel" variant="outlined" />
                                </div>
                                <div className='mt-4'>
                                    <TextField className='w-full' label="วันเกิด" type="date" variant="outlined" InputLabelProps={{ shrink: true }} />
                                </div> */}
                                    <div className='mt-6'>
                                        <p className="text-xl">ข้อมูลผู้ใช้งาน และรหัสผ่าน</p>
                                    </div>
                                    <div className='mt-4'>
                                        <TextField className='w-full'
                                            label={<>ชื่อผู้ใช้งาน <span style={{ color: "#F00" }}>*</span></>}
                                            variant="outlined"
                                            name="username"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.username}
                                            error={errors.username && touched.username}
                                            helperText={errors.username && touched.username ? (
                                                errors.username
                                            ) : null} />
                                    </div>
                                    <div className='mt-4'>
                                        <TextField className='w-full'
                                            label={<>รหัสผ่าน <span style={{ color: "#F00" }}>*</span></>}
                                            type="password" variant="outlined"
                                            name="password"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.password}
                                            error={errors.password && touched.password}
                                            helperText={errors.password && touched.password ? (
                                                errors.password
                                            ) : null} />
                                    </div>
                                    <div className='mt-4'>
                                        <TextField className='w-full'
                                            label={<>ยืนยันรหัสผ่าน <span style={{ color: "#F00" }}>*</span></>}
                                            type="password" variant="outlined"
                                            name="passwordConfirmation"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            value={values.passwordConfirmation}
                                            error={errors.passwordConfirmation && touched.passwordConfirmation}
                                            helperText={errors.passwordConfirmation && touched.passwordConfirmation ? (
                                                errors.passwordConfirmation
                                            ) : null} />
                                    </div>
                                    <div className='mt-4 mb-2'>
                                        <FormControlLabel
                                            className='mb-2'
                                            value={values.receiveNewsletter}
                                            label={`ข้าพเจ้ายอมรับ ข้อมูล ข่าวสารต่างๆ จาก thaimerit ผ่านทางอีเมล และช่องทางอื่นๆ`}
                                            control={<Checkbox name="receiveNewsletter" onChange={handleChange} inputProps={{ 'aria-label': 'controlled' }} />}
                                        />

                                        <FormControlLabel
                                            className=''
                                            control={
                                                <Checkbox
                                                    error
                                                    id="acceptPolicyPrivacy"
                                                    name="acceptPolicyPrivacy"
                                                    color="primary"
                                                    onChange={handleChange}
                                                    onBlur={handleBlur}
                                                />
                                            }
                                            value={values.acceptPolicyPrivacy}
                                            id="acceptPolicyPrivacy"
                                            name="acceptPolicyPrivacy"
                                            label={<><span style={{ color: "#F00" }}>*</span> ข้าพเจ้ารับทราบและยอมรับเงื่อนไข จาก thaimerit <br /><a target="_blank" href="/pages/privacy"><u>คลิกอ่านเพิ่มเติม “ข้อตกลงและนโยบายความเป็นส่วนตัว”</u></a></>}
                                            sx={(errors.acceptPolicyPrivacy && touched.acceptPolicyPrivacy) ? { color: "#d32f2f" } : {}}

                                        />

                                        <FormHelperText className='mx-8' error={errors.acceptPolicyPrivacy && touched.acceptPolicyPrivacy}>
                                            {errors.acceptPolicyPrivacy && touched.acceptPolicyPrivacy ? (
                                                errors.acceptPolicyPrivacy
                                            ) : null}
                                        </FormHelperText>

                                        <br />




                                    </div>
                                    <Button type="submit" className="w-full mt-6 mb-4" loading={isSubmitting} disabled={isSubmitting}>บันทึก</Button>

                                </form>
                            )}
                        </Formik>
                    </div>
                </div>
            </LocalizationProvider>
        </Containner>
    )
}

export const getServerSideProps = setup(async (ctx) => {
    const session = await getSession(ctx)

    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: "/profile"
            }
        }
    }

    return {
        props: {
            session
        }
    }
});