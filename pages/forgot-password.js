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

export default function ForgotPassword({ session }) {

    const { t } = useTranslation();
    const MySwal = withReactContent()
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
        email: Yup.string().email(t('invalid_email')).required(t("required")),
    });

    return (
        <Containner>
            <div className={'flex justify-center content-center items-center mt-6 ' + styles.loginBoxWrapper}>
                <div className={'flex-col items-center ' + styles.loginBox}>
                    <Formik
                        initialValues={{
                            email: '',
                        }}
                        validationSchema={LoginSchema}
                        onSubmit={async (values, { setSubmitting }) => {

                            setSubmitting(true)

                            try {
                                let result = await API.forgotPassword(values)

                                MySwal.fire({
                                    icon: 'success',
                                    title: t("successTitle"),
                                    text: t("SendResetPasswordCodeToEmailSuccessfully"),
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
                                        <p className="text-xl">ลืมรหัสผ่าน</p>
                                    </div>

                                    <div className="text-sm text-gray-500 mt-4">
                                        ระบบจะทำการส่งรหัสยืนยันไปที่อีเมลองคุณ
                                    </div>
                                </div>

                                <div className='mt-4'>
                                    <TextField className='w-full' label="อีเมล" variant="outlined"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={isSubmitting}
                                        value={values.email}
                                        error={errors.email && touched.email}
                                        helperText={errors.email && touched.email ? (errors.email) : null} />
                                </div>

                                <Button type="submit" className="w-full mt-6 mb-4" loading={isSubmitting} disabled={isSubmitting}>ลืมรหัสผ่าน</Button>

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