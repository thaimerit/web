import React, { useState } from "react";
import { useRouter } from "next/router";
import LayoutLiff from "../components/layout-liff";
import Head from "next/head";
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import LineEnd from "../components/line-end";
import Button from "../components/button/button";
import HighlightOffIcon from '@mui/icons-material/HighlightOff';

export default function PaymentComplete({ error }) {

    const [loading, setLoading] = useState(false)
    const router = useRouter()

    function onClose() {
        setLoading(true)

        window.close()

        setTimeout(() => {
            router.push(`/`)
        }, 1000)
    }

    if (error) {
        return <div ><div className="flex align-middle items-center justify-center">
            <div className="text-center" style={{ marginTop: "100px" }}>

                <HighlightOffIcon sx={[{ fontSize: 80 }, { color: '#b91c1c' }]} />
                <div style={{ fontSize: 30, color: '#b91c1c' }}>เกิดข้อผิดพลาด</div>
                <div style={{ fontSize: 20 }}>{error}</div>

            </div>
        </div>
            <div style={{ alignItem: "center", position: "absolute", bottom: 0, width: "100%", padding: 20 }}>
                <Button id="close_btn" loading={loading} style={{ position: "absolute", marginBottom: 0 }} type="button" className="w-full mt-4 px-5 rounded linear-bg text-xl" onClick={onClose}>
                    กลับสู่หน้าหลัก
                </Button>
            </div>
        </div>

    }

    return <div >
        <div className="mt-8 mb-8 text-center">
            <CheckCircleOutlineOutlinedIcon sx={[{ fontSize: 80 }, { color: '#61CC7F' }]} />
            <div style={{ fontSize: 30, color: '#61CC7F' }}>ชำระเงินสำเร็จ</div>
        </div>
        <div style={{ alignItem: "center", position: "absolute", bottom: 0, width: "100%", padding: 20 }}>
            <Button id="close_btn" loading={loading} style={{ position: "absolute", marginBottom: 0 }} type="button" className="w-full mt-4 px-5 rounded linear-bg text-xl" onClick={onClose}>
                กลับสู่หน้าหลัก
            </Button>
        </div>
    </div>

}


export async function getServerSideProps(context) {

    let error = context.query.error || false

    return {
        props: {
            error
        },
    };
}

PaymentComplete.getLayout = function getLayout(page) {
    return <LayoutLiff>
        <Head>
            <title>ชำระเงิน</title>
        </Head>
        {page}
    </LayoutLiff>;
}