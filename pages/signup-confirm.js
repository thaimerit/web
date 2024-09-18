import React, { useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";
import Button from "../components/button/button";
import Image from "next/image";
import styles from "../styles/pages/Login.module.scss";
import Containner from "../components/containner";
import LineEnd from "../components/line-end";
import SocialButton from "../components/button/social-button";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { getCsrfToken, getSession, useSession } from "next-auth/react";
import { setup } from "../utils/csrf";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { alertOkButtonColor, danger, primary } from "../utils/variable";
import { useRouter } from "next/router";
import { API } from "../service/apiService";
import { errorHandler } from "../utils/alertUtil";

export default function Signup({ session }) {
    const { t } = useTranslation();
    const MySwal = withReactContent(Swal);
    const router = useRouter();
    const { email } = router.query
    const [sendingCode, setSendingCode] = useState(false);

    const inputOtp1Element = useRef();
    const inputOtp2Element = useRef();
    const inputOtp3Element = useRef();
    const inputOtp4Element = useRef();
    const inputOtp5Element = useRef();
    const inputOtp6Element = useRef();

    const inputs = [
        inputOtp1Element,
        inputOtp2Element,
        inputOtp3Element,
        inputOtp4Element,
        inputOtp5Element,
        inputOtp6Element
    ]

    // useEffect(() => {
    //     if (session) {
    //         router.push("/")
    //     }
    // }, [session])

    // if (session) {
    //     return <div></div>
    // }

    const LoginSchema = Yup.object().shape({
        firstName: Yup.string().required(t("required")),
        lastName: Yup.string().required(t("required")),
        email: Yup.string().email(t("invalid_email")).required(t("required")),
        password: Yup.string().required(t("required")),
        passwordConfirmation: Yup.string().test(
            "passwords-match",
            t("passwords_must_match"),
            function (value) {
                return this.parent.password === value;
            }
        ),
    });

    const sendCode = async (e) => {
        e.preventDefault();

        MySwal.fire({
            icon: "info",
            title: t("Confirm Send OTP"),
            // showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: t("Send OTP"),
            confirmButtonColor: primary,
            // denyButtonText: t("Cancel"),
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    setSendingCode(true)

                    let result = await API.postSendEmailConfirmation({
                        email
                    })

                    setSendingCode(false)

                    MySwal.fire({
                        icon: 'success',
                        title: t("successTitle"),
                        text: t("sendOtpSuccessfully"),
                        confirmButtonText: t('OK'),
                        confirmButtonColor: primary,
                    })

                } catch (error) {
                    let errorMessage = errorHandler(error)
                    setSendingCode(false)
                    MySwal.fire({
                        icon: "error",
                        title: t("errorTitle"),
                        text: t(errorMessage),
                        confirmButtonText: t("OK"),
                        confirmButtonColor: primary,
                    });
                }

            }
        })


    }

    const onClickInput = (e) => {
        e.nativeEvent.target.select();
    }

    const onKeyUp = (setFieldValue) => (e) => {
        let name = e.nativeEvent.target.name
        let value = e.nativeEvent.target.value
        let number = +name.replace("otp", "")

        let key = e.nativeEvent.key.replace(/\D/g, '')
        if (key) {
            // e.nativeEvent.target.value = key
            setFieldValue(`otp${number}`, key)

            if (number < 6) {
                inputs[number].current.focus();
            } else {
                e.nativeEvent.target.blur();
            }
        } else {
            setFieldValue(`otp${number}`, "")
        }
    }

    useEffect(() => {
        API.init(session)
    }, [])

    return (
        <Containner>
            <div
                className={
                    "flex justify-center content-center items-center mt-6 " +
                    styles.loginBoxWrapper
                }
            >
                <div className={"flex-col items-center " + styles.loginBox}>
                    <Formik
                        initialValues={{
                            otp1: "",
                            otp2: "",
                            otp3: "",
                            otp4: "",
                            otp5: "",
                            otp6: "",
                            email: email ? email : null,
                        }}
                        onSubmit={async (values, { setSubmitting, setFieldValue }) => {
                            try {


                                let confirmCode = `${values.otp1}${values.otp2}${values.otp3}${values.otp4}${values.otp5}${values.otp6}`
                                // let email = session.user.email

                                // console.log(session.user.email)
                                // console.log(confirmCode)

                                // return

                                // setTimeout(() => {

                                //     setSubmitting(false)

                                //     MySwal.fire({
                                //         icon: 'success',
                                //         title: t("successTitle"),
                                //         text: t("confirmOtpSuccessfully"),
                                //         confirmButtonText: t('OK'),
                                //         confirmButtonColor: primary,
                                //     }).then(() => {
                                //         // router.push('/login')
                                //     })

                                // }, 1000)

                                let result = await API.postAuthEmailConfirm({
                                    confirmation: confirmCode
                                })

                                MySwal.fire({
                                    icon: 'success',
                                    title: t("successTitle"),
                                    text: t("confirmOtpSuccessfully"),
                                    confirmButtonText: t('OK'),
                                    confirmButtonColor: primary,
                                }).then(() => {
                                    router.push("/login");
                                });
                            } catch (error) {

                                setFieldValue("otp1", "")
                                setFieldValue("otp2", "")
                                setFieldValue("otp3", "")
                                setFieldValue("otp4", "")
                                setFieldValue("otp5", "")
                                setFieldValue("otp6", "")

                                let errorMessage = errorHandler(error)

                                MySwal.fire({
                                    icon: "error",
                                    title: t("errorTitle"),
                                    text: t(errorMessage),
                                    confirmButtonText: t("OK"),
                                    confirmButtonColor: primary,
                                });
                                setSubmitting(false);
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
                            <form
                                onSubmit={handleSubmit}
                                method="post"
                                action="/api/auth/callback/credentials"
                            >
                                {/* <input name="csrfToken" type="hidden" defaultValue={csrfToken} /> */}

                                <img src="/images/logo-big.png" className={styles.logo} />

                                <div className="text-center mt-6">
                                    <div className="">
                                        <p className="text-xl">Email Verification</p>
                                    </div>

                                    <div className="text-sm text-gray-500 mt-4">
                                        {/* กรุณากรอกโค้ดที่ได้รับในอีเมลของคุณ */}
                                        กรุณากรอกโค้ดที่ส่งไปยัง{" "}
                                        <span className="font-bold text-black">{values.email}</span>
                                    </div>
                                </div>
                                {/* <div className='mt-4'>
                                    <TextField className='w-full' label="ชื่อผู้ใช้งาน" variant="outlined" />
                                </div> */}
                                <div className="mt-6 flex justify-between">
                                    <TextField
                                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                                        className={styles.otp}
                                        type="number"
                                        pattern="\d*"
                                        variant="outlined"
                                        name="otp1"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onClick={onClickInput}
                                        onKeyUp={onKeyUp(setFieldValue)}
                                        focused={values.otp1 ? true : false}
                                        value={values.otp1}
                                        error={errors.otp1 && touched.otp1}
                                        autoComplete="off"
                                        disabled={isSubmitting}
                                        helperText={
                                            errors.otp1 && touched.otp1 ? (
                                                <div>{errors.otp1}</div>
                                            ) : null
                                        }
                                        inputRef={inputOtp1Element}
                                    />
                                    <TextField
                                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                                        className={styles.otp}
                                        type="number"
                                        pattern="\d*"
                                        variant="outlined"
                                        name="otp2"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onClick={onClickInput}
                                        onKeyUp={onKeyUp(setFieldValue)}
                                        focused={values.otp2 ? true : false}
                                        value={values.otp2}
                                        error={errors.otp2 && touched.otp2}
                                        autoComplete="off"
                                        disabled={isSubmitting}
                                        helperText={
                                            errors.otp2 && touched.otp2 ? (
                                                <div>{errors.otp2}</div>
                                            ) : null
                                        }
                                        inputRef={inputOtp2Element}
                                    />
                                    <TextField
                                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                                        className={styles.otp}
                                        type="number"
                                        pattern="\d*"
                                        variant="outlined"
                                        name="otp3"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onClick={onClickInput}
                                        onKeyUp={onKeyUp(setFieldValue)}
                                        focused={values.otp3 ? true : false}
                                        value={values.otp3}
                                        error={errors.otp3 && touched.otp3}
                                        autoComplete="off"
                                        disabled={isSubmitting}
                                        helperText={
                                            errors.otp3 && touched.otp3 ? (
                                                <div>{errors.otp3}</div>
                                            ) : null
                                        }
                                        inputRef={inputOtp3Element}
                                    />
                                    <TextField
                                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                                        className={styles.otp}
                                        type="number"
                                        pattern="\d*"
                                        variant="outlined"
                                        name="otp4"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onClick={onClickInput}
                                        onKeyUp={onKeyUp(setFieldValue)}
                                        value={values.otp4}
                                        error={errors.otp4 && touched.otp4}
                                        focused={values.otp4 ? true : false}
                                        autoComplete="off"
                                        disabled={isSubmitting}
                                        helperText={
                                            errors.otp4 && touched.otp4 ? (
                                                <div>{errors.otp4}</div>
                                            ) : null
                                        }
                                        inputRef={inputOtp4Element}
                                    />
                                    <TextField
                                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                                        className={styles.otp}
                                        type="number"
                                        pattern="\d*"
                                        variant="outlined"
                                        name="otp5"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onClick={onClickInput}
                                        onKeyUp={onKeyUp(setFieldValue)}
                                        focused={values.otp5 ? true : false}
                                        value={values.otp5}
                                        error={errors.otp5 && touched.otp5}
                                        autoComplete="off"
                                        disabled={isSubmitting}
                                        helperText={
                                            errors.otp5 && touched.otp5 ? (
                                                <div>{errors.otp5}</div>
                                            ) : null
                                        }
                                        inputRef={inputOtp5Element}
                                    />
                                    <TextField
                                        inputProps={{ min: 0, style: { textAlign: "center" } }}
                                        className={styles.otp}
                                        type="number"
                                        pattern="\d*"
                                        variant="outlined"
                                        name="otp6"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        onClick={onClickInput}
                                        onKeyUp={onKeyUp(setFieldValue)}
                                        focused={values.otp6 ? true : false}
                                        value={values.otp6}
                                        error={errors.otp6 && touched.otp6}
                                        autoComplete="off"
                                        disabled={isSubmitting}
                                        helperText={
                                            errors.otp6 && touched.otp6 ? (
                                                <div>{errors.otp6}</div>
                                            ) : null
                                        }
                                        inputRef={inputOtp6Element}
                                    />
                                </div>

                                <div className="text-center mt-6">
                                    <div className="text-sm text-gray-500 mt-4">
                                        ไม่ได้รับโค้ด?{" "}
                                        <a href="#" onClick={sendCode} disabled={isSubmitting || sendingCode} className="font-bold text-green-500">ส่งอีกครั้ง</a>
                                    </div>
                                </div>

                                <Button
                                    type="submit"
                                    className="w-full mt-6 mb-4"
                                    loading={isSubmitting}
                                    disabled={isSubmitting || !(values.otp1 && values.otp2 && values.otp3 && values.otp4 && values.otp5 && values.otp6)}
                                >
                                    ยืนยัน OTP
                                </Button>
                            </form>
                        )}
                    </Formik>
                </div>
            </div>
        </Containner>
    );
}

export const getServerSideProps = async (ctx) => {
    const session = await getSession(ctx);

    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: "/"
            }
        }
    }

    return {
        props: {
            session,
        },
    };
};
