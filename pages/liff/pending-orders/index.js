import React, { useEffect, useState } from "react";
import Button from "../../../components/button/button";
import { getSession, signIn, signOut } from "next-auth/react";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider, MobileDatePicker } from "@mui/x-date-pickers";
import DatePickerSwiper from "../../../components/date-picker-swiper/datePickerSwiper";
import MiniSlideNew from "../../../components/slides/mini-slide-new";
import { API } from "../../../service/apiService";
import * as moment from "moment";
import { getCoverImagesNoAttributes } from "../../../utils/coverImages";
import LayoutLiff from "../../../components/layout-liff";
import { numberFormat } from "../../../utils/numberFormat";
import { useRouter } from "next/router";
import { checkUserActive, checkUserLiffActive } from "../../../utils/authUtil";
import { LoadingScreen } from "../../../components/loading-screen";
import { Formik } from "formik";
import { TextField } from "@mui/material";
import PageItemsPaginate from "../../../components/pending-orders/page-items-paginate";
import Head from "next/head";

export default function Orders({ session }) {
    const router = useRouter();

    const [date, setDate] = useState(
        router.query.date ? moment(router.query.date) : moment()
    );
    const [initing, setIniting] = useState(true);
    const [loading, setLoading] = useState(true);
    const [period, setPeriod] = useState(
        router.query.period ? router.query.period : "morning"
    );
    const [packages, setPackages] = useState([]);
    const [pagination, setPagination] = useState({
        page: 0,
        pageCount: 0,
        pageSize: 0,
        total: 0,
    });

    useEffect(() => {
        if (!session) {
            signIn("line");
            return;
        }

        API.init(session);

        initData();
    }, []);

    async function initData() {
        try {
            let user = await API.liffProfile();
            if (!user) {
                await signOut({redirect: false})
                router.push("/liff/no-auth");
                return
            }
        } catch (error) {
            console.error("ERROR---->", error.response);
            if(error.response.status == 401){
                await signOut({redirect: false})
                router.push("/liff/no-auth");
                return
            }
        }
        setIniting(false)
    }

    if (initing) return <LoadingScreen/>;
    return (
        <div>
            <PageItemsPaginate apiUrl={"/liff/pending-orders"} className={"mb-5"} />
        </div>
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

Orders.getLayout = function getLayout(page) {
    return <LayoutLiff>
        <Head>
            <title>รายการรอยืนยันรับงาน</title>
        </Head>
        {page}
    </LayoutLiff>;
};
