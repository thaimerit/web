import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import Button from "../../components/button/button";
import Image from "next/image";
import styles from "../../styles/pages/Profile.module.scss";
import Containner from "../../components/containner";
import LineEnd from "../../components/line-end";
import SocialButton from "../../components/button/social-button";
import Breadcrumbs from "../../components/breadcrumbs";
import Booking from "../../components/booking/booking";
import MySwiper from "../../components/my-swiper/my-swiper";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { API } from "../../service/apiService";
import { alertOkButtonColor, primary } from "../../utils/variable";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { errorHandler, withReactContent } from "../../utils/alertUtil";
import { checkUserActive, checkUserLiffActive } from "../../utils/authUtil";
import MiniSlide from "../../components/slides/mini-slide";
import DatePickerSwiper from "../../components/date-picker-swiper/datePickerSwiper";
import LayoutLiff from "../../components/layout-liff";
import * as moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import { numberFormat } from "../../utils/numberFormat";
import { LoadingScreen } from "../../components/loading-screen";
export default function Summary({ session }) {
    const router = useRouter()
    const [date, setDate] = useState(moment());
    const [initing, setIniting] = useState(true);
    const [loading, setLoading] = useState(false);
    const [summary, setSummary] = useState({
        data: {},
        meta: {},
    });

    useEffect(() => {
        if (!session) {
            signIn("line");
            return;
        }
        initData();
    }, []);

    useEffect(() => {
        if(initing || !date) return
        getData();
    }, [date]);

    async function initData() {
        API.init(session);

        try {
            let user = await API.liffProfile();
            if (!user) {
                await signOut({ redirect: false });
                router.push("/liff/no-auth");
                return;
            }
        } catch (error) {
            console.error("ERROR---->", error.response);
            if (error.response.status == 401) {
                await signOut({ redirect: false });
                router.push("/liff/no-auth");
                return;
            }
        }
        setIniting(false)
    }

    function onChangeDate(date) {
        setDate(date)
    }

    async function getData() {
        setLoading(true);
        API.init(session);
        try {
            let summary = await API.liffSummary({
                date: date.format("YYYY-MM-DD"),
            });

            setSummary(summary);

        } catch (error) {
            console.log(error)
        }
        setLoading(false);
    }

    if (initing) return <LoadingScreen />;

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div>
                {/* <DatePickerSwiper onChange={(date) => setDate(date)} /> */}
                <div className="flex justify-center py-6">
                    <div className="flex justify-center items-center">
                        กรุณาเลือกวันที่
                    </div>
                </div>
                <div className="mx-5">
                    <MobileDatePicker
                        label="วันที่"
                        inputFormat="MM/DD/YYYY"
                        value={date}
                        onChange={date => onChangeDate(date)}
                        renderInput={(params) => (
                            <TextField className="w-full" {...params} />
                        )}
                        closeOnSelect={true}
                    />
                </div>
                {loading && (
                    <div className="text-center mt-8">
                        <CircularProgress
                            sx={{ fontSize: "80px", color: "#61CC7F" }}
                        />
                        <div
                            className="text-center"
                            style={{ color: "#61CC7F", fontSize: "30px" }}
                        >
                            กำลังโหลด...
                        </div>
                    </div>
                )}

                {!loading && (
                    <div className="p-5">
                        <p className="mb-5">สรุปรายได้ประจำวัน</p>
                        <p className="mb-5">
                            {date.clone().add(543).format("DD/MM/YY")}
                        </p>
                        <div className="my-8">
                            <LineEnd />
                        </div>
                        {/* <div className="grid grid-cols-2 content-center">
                            <div className="">
                                <p className="text-left">
                                    รายการ ({summary?.meta?.total || 0})
                                </p>
                            </div>
                            <div className="">
                                <p className="text-right">
                                    {summary?.meta?.sum ? numberFormat(summary.meta.sum) : 0} บาท
                                </p>
                            </div>
                            
                        </div> */}

                        <div className="text-center">comming soon...</div>
                        
                        <div className="my-8">
                            <LineEnd />
                        </div>
                        <p className="text-xs mb-5 text-center">
                            เงินจะถูกโอนเข้าบัญชีของคุณที่ลงทะเบียนไว้ภายใน 24
                            ชั่วโมง
                        </p>
                    </div>
                )}
            </div>
        </LocalizationProvider>
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    return {
        props: {
            session,
        },
    };
}

Summary.getLayout = function getLayout(page) {
    return <LayoutLiff>{page}</LayoutLiff>;
};
