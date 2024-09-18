import React, { useEffect, useState } from 'react';
import { TextField, Checkbox, FormControlLabel } from '@mui/material';
import Button from '../components/button/button';
import Image from 'next/image';
import styles from '../styles/pages/Profile.module.scss'
import Containner from '../components/containner';
import LineEnd from '../components/line-end';
import SocialButton from '../components/button/social-button';
import Breadcrumbs from '../components/breadcrumbs';
import Booking from '../components/booking/booking';
import MySwiper from '../components/my-swiper/my-swiper';
import ProfileSideBar from '../components/profile/profile-sidebar';
import { API } from '../service/apiService';
import { getSession } from 'next-auth/react';
import { checkUserActive } from '../utils/authUtil';
import { Formik } from "formik";
import { alertOkButtonColor, primary } from '../utils/variable';
import { withReactContent } from '../utils/alertUtil';
import { useTranslation } from 'react-i18next';
import { useRouter } from 'next/router';

export default function Notification({ session, receiveNewsletter }) {

    const { t } = useTranslation();
    const MySwal = withReactContent()
    const router = useRouter()

    // const [checked, setChecked] = React.useState(receiveNewsletter);

    // const handleChange = (event) => {
    //     setChecked(event.target.checked);
    // };

    useEffect(() => {
        API.init(session);
    }, []);

    return (
        <Containner>
            <div className='py-4'>
                <Breadcrumbs items={[
                    {
                        label: "หน้าหลัก",
                        url: "#",
                    },
                    {
                        label: "บัญชีของฉัน",
                        url: "#",
                    }
                ]} />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">
                <div className="col-span-4 sm:col-span-1">
                    <ProfileSideBar active="notification" />
                </div>
                <Formik
                    initialValues={{
                        receiveNewsletter
                    }}
                    onSubmit={async (values, { setSubmitting }) => {
                        let data = {};

                        Object.keys(values).forEach((key) => {
                            if (values[key] != "") {
                                data[key] = values[key];
                            }
                        });

                        try {
                            let result = await API.patchProfile(data);

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
                            <div className='col-span-3 px-0'>
                                <div className='detail'>
                                    <h3 className='title'>รับข่าวสารจากระบบ</h3>
                                    <FormControlLabel
                                        label="ยอมรับข่าวสารผ่านทางอีเมลที่ลงทะเบียนไว้"
                                        control={<Checkbox checked={values.receiveNewsletter} onChange={value => setFieldValue("receiveNewsletter", value.target.checked)} />}
                                    />
                                </div>
                                <Button type="submit" className="mt-10 mb-10 py-4 px-20" disabled={isSubmitting}>บันทึก </Button>
                            </div>

                        </form>

                    )}
                </Formik>
            </div>
        </Containner>
    )
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
    let receiveNewsletter = result.data.receiveNewsletter ? result.data.receiveNewsletter : false;

    return {
        props: {
            session,
            receiveNewsletter,
        },
    };
}
