import React, { } from "react";
import { getSession } from "next-auth/react";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers";
import LayoutLiff from "../../components/layout-liff";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import Head from "next/head";

export default function NoAuth({ session, user, banks }) {
    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div className="flex align-middle items-center justify-center">
                <div className="text-center" style={{marginTop:"100px"}}>

                    <HighlightOffIcon sx={[{ fontSize: 80 }, { color: '#b91c1c' }]} />
                    <div style={{ fontSize: 30, color: '#b91c1c' }}>ไม่มีข้อมูล</div>

                </div>
            </div>
        </LocalizationProvider>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);

    return {
        props: {
            session
        },
    };
}


NoAuth.getLayout = function getLayout(page) {
    return (
        <LayoutLiff>
            <Head>
                <title>Not Found</title>
            </Head>
            {page}
        </LayoutLiff>
    )
}