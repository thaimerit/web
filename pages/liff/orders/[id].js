import React, { useEffect, useState } from "react";
import Button from "../../../components/button/button";
import styles from "../../../styles/pages/LiffOrderDetail.module.scss";
import LineEnd from "../../../components/line-end";
import { getSession, signIn, signOut } from "next-auth/react";
import { API } from "../../../service/apiService";
import { alertOkButtonColor, primary } from "../../../utils/variable";
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { errorHandler, withReactContent } from "../../../utils/alertUtil";
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import Price from "../../../components/price";
import { getCoverImagesNoAttributes } from "../../../utils/coverImages";
import moment from "moment";
import { t } from "i18next";
import Link from "next/link";
import { EvidenceOfAction } from "../../../components/payment/evidenceOfAction";
import LayoutLiff from "../../../components/layout-liff";
import { checkUserLiffActive } from "../../../utils/authUtil";
import { LoadingScreen } from "../../../components/loading-screen";
import Head from "next/head";
import { filterHtmlUtil } from "../../../utils/filterHtmlUtil";

export default function Transaction({ session }) {

    const router = useRouter()
    const { id } = router.query

    const [order, setOrder] = useState(null)
    const [thumbnail, setThumbnail] = useState(null)
    const [loading, setLoading] = useState(true);
    const MySwal = withReactContent()

    useEffect(() => {
        if (!session) {
            signIn("line")
            return
        }
        API.init(session)
        initData()
    }, [])

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

        try {
            let order = await API.getPartnerOrder(id)

            if(order.partnerAcceptStatus=="pending"){
                router.replace(`/liff/pending-orders/${id}`);
                return
            }

            if (order.evidenceOfActions) {
                order.evidenceOfActions = order.evidenceOfActions.map(photo => {
                    photo.url = API.assetUrl(photo.url)
                    return photo
                })
            }

            setOrder(order)
            let thumbnail = getCoverImagesNoAttributes(order.package.coverImages, "pc")
            if (thumbnail) {
                setThumbnail(thumbnail)
            }
        } catch (error) {
            router.push("/liff/not-found")
        }

        setLoading(false)
    }

    function onSubmit() {
        MySwal.fire({
            icon: "info",
            title: t("Confirm Complete Order"),
            confirmButtonText: t("Confirm"),
            cancelButtonText: t("Cancel"),
            confirmButtonColor: primary,
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {

                setLoading(true)

                try {
                    await API.partnerOrder_Complete(order.id)

                    MySwal.fire({
                        icon: 'success',
                        title: t("updateSuccessTitle"),
                        confirmButtonText: t('OK'),
                        confirmButtonColor: alertOkButtonColor,
                    }).then(() => {
                        router.replace("/liff/orders")
                    })

                } catch (error) {
                    let errorMessage = errorHandler(error);
                    MySwal.fire({
                        icon: "error",
                        title: t("errorTitle"),
                        text: t(errorMessage),
                        confirmButtonText: t("OK"),
                        confirmButtonColor: primary,
                    });
                }

                setLoading(false)
            }
        })
    }

    if (loading) return <LoadingScreen/>;

    if (!order) return <></>

    let dateText = order.orderItem.date ? moment(order.orderItem.date).add(543, "year").format("DD MMMM YYYY") : ""

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div>
                {/* <div className="bg-white drop-shadow-lg h-[4.2rem] grid grid-cols-8 border-1 grid content-center">
                    <div className="col-span-8"><p className="text-center">รายละเอียด</p></div>
                </div> */}

                <div className="p-5">
                    {order.status == "complete" && <div className="mb-8 text-center">
                        <CheckCircleOutlineOutlinedIcon sx={[{ fontSize: 80 }, { color: '#61CC7F' }]} />
                        <div style={{ fontSize: 30, color: '#61CC7F' }}>จบงานแล้ว</div>

                        <LineEnd className="mt-4" />
                    </div>}
                    <div className='grid grid-cols-5'>
                        <div className='col-span-2 pr-2'>
                            <div className={styles.thumbnail}>
                                {thumbnail && <img src={thumbnail} className={styles.thumbnailImage} />}
                            </div>
                        </div>
                        <div className='col-span-3 pl-2'>
                            <p className='text-sm'>เลขที่คำสั่งซื้อ #{order.id}</p>
                            <p className='text-[10px] text-gray-400 mb-2'>{order.package.fullname}</p>
                            <p className='text-[10px] text-gray-400 mb-2'>{order.package.place.highlightName}</p>
                            <p className='text-[10px] text-gray-400 mb-2'>จำนวน {order.orderItem.qty} ชุด</p>
                            <p className='text-[10px] text-primary mb-2'>วันที่ต้องทำพิธี</p>
                            <p className='text-[10px] text-gray-400 mb-2'>วันที่ {dateText} ({t(order.packagePeriod)})</p>
                            {/* <p className='text-xs'>ราคา <Price price={order.package?.price} promotionPrice={order.package?.promotionPrice} /> บาท / ชุด</p> */}
                        </div>
                    </div>

                    <div className="my-8">
                        <LineEnd />

                    </div>
                    <p className="text-lg text-primary">ชื่อผู้ขอพร</p>
                    <div className="text-sm mb-5 leading-8" dangerouslySetInnerHTML={{ __html: filterHtmlUtil(order.customer_name) || "-" }}></div>
                    <div className="my-8">
                        <LineEnd />

                    </div>
                    <p className="text-lg text-primary">คำอธิษฐานขอพร</p>
                    <div className="text-sm mb-5 leading-8" dangerouslySetInnerHTML={{ __html: filterHtmlUtil(order.orderItem.prayword) || "-" }}></div>
                    <div className="my-8">
                        <LineEnd />

                    </div>
                    <p className="text-lg text-primary mb-5">ส่งหลักฐานการทำบุญ</p>
                    <div className="mb-5">
                        {/* <img src="/images/liff/transaction/card-small-1.png" /> */}
                    </div>
                    <p className="text-lg mb-5">อัพโหลดรูปภาพ</p>
                    <p className="text-xs">กรุณาเลือกรูปจากมือถือและอัพโหลดเข้าระบบ</p>

                    {(order && !loading) && <EvidenceOfAction order={order} />}

                    {order.status == "approve" && <Button type="button" className="w-full mt-4 px-5 rounded linear-bg" loading={loading} onClick={onSubmit}>
                        จบงาน
                    </Button>}
                </div>

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

Transaction.getLayout = function getLayout(page) {
    return (
        <LayoutLiff>
            <Head>
                <title>รายละเอียด</title>
            </Head>
            {page}
        </LayoutLiff>
    )
}