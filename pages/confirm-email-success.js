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
import { getCsrfToken, getSession, signIn, useSession } from "next-auth/react";
import { setup } from "../utils/csrf";
import axios from "axios";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { alertOkButtonColor, danger, primary } from "../utils/variable";
import { useRouter } from "next/router";
import { API } from "../service/apiService";
import { errorHandler } from "../utils/alertUtil";

export default function ConfirmEmailSuccess({ session }) {
    const { t } = useTranslation();
    const MySwal = withReactContent(Swal);
    const router = useRouter();

    useEffect(() => {
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

                    <img src="/images/logo-big.png" className={styles.logo} />

                    <div className="text-center mt-6">
                        <div className="">
                            <p className="text-xl">Email Verification</p>
                        </div>

                        <div className="text-sm text-gray-500 mt-4">
                            {/* กรุณากรอกโค้ดที่ได้รับในอีเมลของคุณ */}
                            {t("confirmOtpSuccessfully")}
                        </div>

                        <Button
                            type="button"
                            className="w-full mt-6 mb-4"
                            onClick={() => signIn()}
                        >
                            เข้าสุ่ระบบ
                        </Button>
                    </div>


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
