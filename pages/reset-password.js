import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Button from '../components/button/button';
import Image from 'next/image';
import styles from '../styles/pages/Login.module.scss'
import Containner from '../components/containner';
import LineEnd from '../components/line-end';
import SocialButton from '../components/button/social-button';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { useTranslation } from 'react-i18next';
import { getCsrfToken, getSession, signIn, useSession } from 'next-auth/react';
import { setup } from '../utils/csrf';
import axios from 'axios';
import { alertOkButtonColor, primary } from '../utils/variable';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { API } from '../service/apiService';
import { errorHandler, withReactContent } from '../utils/alertUtil';

export default function ResetPassword({ session }) {

    const { t } = useTranslation();
    const MySwal = withReactContent()
    const router = useRouter()
    const { code } = router.query

    useEffect(() => {
        if (session || !code) {
            router.push("/")
        }
    }, [session])

    if (session) {
        return <div></div>
    }

    const LoginSchema = Yup.object().shape({
        password: Yup.string().required(t("required")),
        passwordConfirmation: Yup.string()
            .test('passwords-match', t('passwords_must_match'), function (value) {
                return this.parent.password === value
            })
    });

    return (
        <Containner>
            <div className={'flex justify-center content-center items-center mt-6 ' + styles.loginBoxWrapper}>
                <div className={'flex-col items-center ' + styles.loginBox}>
                    <Formik
                        initialValues={{
                            code,
                            password: '',
                            passwordConfirmation: ''
                        }}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting }) => {

                            setSubmitting(true)

                            try {
                                let result = await API.resetPassword(values)

                                MySwal.fire({
                                    icon: 'success',
                                    title: t("successTitle"),
                                    text: t("Chage Password Success"),
                                    confirmButtonText: t('OK'),
                                    confirmButtonColor: alertOkButtonColor,
                                }).then(() => {
                                    // router.reload(window.location.pathname)
                                    router.push('/login')
                                })
                            } catch (error) {
                                setSubmitting(false)
                                let errorMessage = errorHandler(error)
                                MySwal.fire({
                                    icon: 'error',
                                    title: t("errorTitle"),
                                    text: t(errorMessage),
                                    confirmButtonText: t('OK'),
                                    confirmButtonColor: primary,
                                })
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
                            /* and other goodies */
                        }) => (
                            <form onSubmit={handleSubmit} method="post" action="/api/auth/callback/credentials">
                                
                                <img src="/images/logo-big.png" className={styles.logo} />

                                <div className="text-center mt-6">
                                    <div className="">
                                        <p className="text-xl">เปลี่ยนรหัสผ่าน</p>
                                    </div>
                                </div>
                                <div className='mt-4'>
                                    <TextField className='w-full' label="รหัสผ่าน" type="password" variant="outlined"
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
                                    <TextField className='w-full' label="ยืนยันรหัสผ่าน" type="password" variant="outlined"
                                        name="passwordConfirmation"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        value={values.passwordConfirmation}
                                        error={errors.passwordConfirmation && touched.passwordConfirmation}
                                        helperText={errors.passwordConfirmation && touched.passwordConfirmation ? (
                                            errors.passwordConfirmation
                                        ) : null} />
                                </div>

                                <Button type="submit" className="w-full mt-6 mb-4" loading={isSubmitting} disabled={isSubmitting}>{t("Chage Password")}</Button>

                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </Containner>
    )
}

export const getServerSideProps = async (ctx) => {
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
};