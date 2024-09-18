import React, { useState, useEffect } from "react";
import { CircularProgress, TextField } from "@mui/material";
import Button from "../components/button/button";
import Image from "next/image";
import styles from "../styles/pages/Profile.module.scss";
import Containner from "../components/containner";
import LineEnd from "../components/line-end";
import SocialButton from "../components/button/social-button";
import Breadcrumbs from "../components/breadcrumbs";
import Booking from "../components/booking/booking";
import MySwiper from "../components/my-swiper/my-swiper";
import ProfileSideBar from "../components/profile/profile-sidebar";
import { API } from "../service/apiService";
import { useRouter } from "next/router";
import { errorHandler, withReactContent } from "../utils/alertUtil";
import { useTranslation } from "react-i18next";
import { Formik } from "formik";
import * as Yup from "yup";
import { getSession } from "next-auth/react";
import { checkUserActive } from "../utils/authUtil";
import { alertOkButtonColor, primary } from "../utils/variable";

export default function Address({ session, user }) {
    const { t } = useTranslation();
    const MySwal = withReactContent();
    const router = useRouter();

    useEffect(() => {
        API.init(session);
    }, []);

    const ProfileSchema = Yup.object().shape({
        address: Yup.string(),
        village: Yup.string(),
        street: Yup.string(),
        alley: Yup.string(),
        province: Yup.string(),
        zipCode: Yup.string(),
        district: Yup.string(),
        subDistrict: Yup.string(),
    });

    if (!session) {
        return (
            <CircularProgress
                color="inherit"
                size={20}
                sx={{ marginRight: "10px" }}
            />
        );
    }

    return (
        <Containner>
            <div className="py-4">
                <Breadcrumbs
                    items={[
                        {
                            label: "หน้าหลัก",
                            url: "#",
                        },
                        {
                            label: "บัญชีของฉัน",
                            url: "#",
                        },
                    ]}
                />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">
                <div className="col-span-4 sm:col-span-1">
                    <ProfileSideBar active="address" />
                </div>

                <Formik
                    initialValues={{
                        address: user?.address || "",
                        village: user?.village || "",
                        street: user?.street || "",
                        alley: user?.alley || "",
                        province: user?.province || "",
                        district: user?.district || "",
                        subDistrict: user?.subDistrict || "",
                        zipCode: user?.zipCode || "",
                    }}
                    validationSchema={ProfileSchema}
                    onSubmit={async (values, { setSubmitting }) => {
                        let data = {};

                        Object.keys(values).forEach((key) => {
                            if (values[key] != "") {
                                data[key] = values[key];
                            }
                        });

                        try {
                            let result = await API.patchProfile({address:data});

                            MySwal.fire({
                                icon: "success",
                                title: t("updateSuccessTitle"),
                                confirmButtonText: t("OK"),
                                confirmButtonColor: alertOkButtonColor,
                            }).then(() => {
                                router.reload(window.location.pathname);
                            });
                        } catch (error) {
                            let errorMessage = errorHandler(error);

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
                        setFieldValue,
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit} className="col-span-4 sm:col-span-3 sm:px-0 sm:py10">
                            <div className="detail">
                                <h3 className="title">ที่อยู่</h3>
                                <div>กรุณากรอกที่อยู่จัดส่งของคุณ</div>

                                <div className="mt-6">
                                    <TextField
                                        className="w-full"
                                        label="เลขที่"
                                        name="address"
                                        value={values.address}
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.address && touched.address}
                                        helperText={
                                            errors.address && touched.address ? errors.address : null
                                        }
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                                        <TextField
                                            className="w-full"
                                            label="อาคาร / หมู่บ้าน"
                                            name="village"
                                            value={values.village}
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.village && touched.village}
                                            helperText={
                                                errors.village && touched.village ? errors.village : null
                                            }
                                        />
                                    </div>
                                    <div className="mt-6 sm:ml-10 col-span-2 sm:col-span-1">
                                        <TextField
                                            className="w-full"
                                            label="ถนน"
                                            name="street"
                                            value={values.street}
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.street && touched.street}
                                            helperText={
                                                errors.street && touched.street ? errors.street : null
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                                        <TextField
                                            className="w-full"
                                            label="จังหวัด"
                                            name="province"
                                            value={values.province}
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.province && touched.province}
                                            helperText={
                                                errors.province && touched.province ? errors.province : null
                                            }
                                        />
                                    </div>
                                    <div className="mt-6 sm:ml-10 col-span-2 sm:col-span-1">
                                        <TextField
                                            className="w-full"
                                            label="รหัสไปรษณีย์"
                                            name="zipCode"
                                            value={values.zipCode}
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.zipCode && touched.zipCode}
                                            helperText={
                                                errors.zipCode && touched.zipCode ? errors.zipCode : null
                                            }
                                        />
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 mt-5">
                                    <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                                        <TextField
                                            className="w-full"
                                            label="แขวง"
                                            name="subDistrict"
                                            value={values.subDistrict}
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.subDistrict && touched.subDistrict}
                                            helperText={
                                                errors.subDistrict && touched.subDistrict ? errors.subDistrict : null
                                            }
                                        />
                                    </div>
                                    <div className="mt-6 sm:ml-10 col-span-2 sm:col-span-1">
                                        <TextField
                                            className="w-full"
                                            label="เขต"
                                            name="district"
                                            value={values.district}
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.district && touched.district}
                                            helperText={
                                                errors.district && touched.district ? errors.district : null
                                            }
                                        />
                                    </div>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="my-10 px-10"
                                disabled={isSubmitting}
                            >
                                บันทึกที่อยู่
                            </Button>
                        </form>
                    )}
                </Formik>
            </div>
        </Containner>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login",
            },
        };
    }

    API.init(session);
    let result = await API.getProfile();
    let user = result.data?.address ? result.data?.address : {};

    return {
        props: {
            session,
            user,
        },
    };
}
