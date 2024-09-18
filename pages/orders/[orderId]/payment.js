import Link from 'next/link'
import { useRouter } from 'next/router'
import React, { createRef, useEffect, useState } from "react";
import DonateCheckout from '../../../components/donate/donateCheckout'
import Breadcrumbs from '../../../components/breadcrumbs'
import Containner from '../../../components/containner'
import Fortune from '../../../components/fortune/fortune'
import LineEnd from '../../../components/line-end'
import MySwiper from '../../../components/my-swiper/my-swiper'
import PageTitle from '../../../components/page-title'
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { Box, Tab, TextareaAutosize } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Button from '../../../components/button/button'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Slip from '@mui/icons-material/DescriptionTwoTone';
import Omise from '../../../components/omise'
import { getSession } from 'next-auth/react'
import { checkUserActive } from '../../../utils/authUtil'
import { PaymentDonationDetail } from '../../../components/payment/paymentDonationDetail'
import { PaymentProductDetail } from '../../../components/payment/paymentProductDetail'
import { API } from '../../../service/apiService'
import styles from "../../../styles/order/Order.module.scss";
import { errorHandler, withReactContent } from '../../../utils/alertUtil'
import { useTranslation } from 'react-i18next'
import { primary } from '../../../utils/variable'
import { TransactionSlip } from '../../../components/payment/transactionSlip';
import CartCheckout from '../../../components/cart/cartCheckout';
import PageItemCard from '../../../components/carts/page-item-card';
import PaymentDetail from '../../../components/payment/paymentDetail';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';

function BankAccount({ data }) {
    return <div className='my-5'>
        <img src={API.assetUrl(data.bank?.icon?.url)} className="mb-4" style={{ height: "100px" }}/>
        <p className='mb-4 font-medium'>{data.bank.name}</p>
        <p className='mb-2'>ชื่อบัญชี <span className='text-primary'>{data.account}</span></p>
        <p className='mb-2'>เลขที่บัญชี <span className='text-primary'>{data.no}</span></p>
        <p className='mb-2'>ธนาคาร <span className='text-primary'>{data.bank.name}</span></p>
        <img src={API.assetUrl(data.image?.url)} className={styles.thumbnailImageOrder} />
    </div>
}

function OrderPayment({ session, order, appConfig, bankAccounts, omisePublicKey }) {
    console.log('order',order);
    const router = useRouter()
    const [value, setValue] = useState('1');
    const [amount, setAmount] = useState(2200);
    const { t } = useTranslation();
    const MySwal = withReactContent()
    const inputFileRef = createRef(null);
    const [slipPicture, setSlipPicture] = useState();
    const [hasUploadPicture, setHasUploadPicture] = useState(false);

    const [data, setData] = useState({
        "email": session.user.email,
        "name": session.user.name
    })

    useEffect(() => {
        API.init(session)
        if(order.paymentStatus != "pending"){
            router.push("/transactions/" + order.id)
        }
    }, [])

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onClickUploadFile = (e) => {

        MySwal.fire({
            icon: "info",
            title: t("Confirm Upload Profile image"),
            // showDenyButton: true,
            // showCancelButton: true,
            confirmButtonText: t("Confirm Upload Profile image"),
            confirmButtonColor: primary,
        }).then(async (result) => {
            if (result.isConfirmed) {
                e.preventDefault();
                inputFileRef.current.click();
            }
        })
    }
    const handleOnChangeFile = (e) => {


        const newImage = event.target?.files?.[0];

        if (newImage) {

            setSlipPicture(URL.createObjectURL(newImage));
            setHasUploadPicture(newImage);
        }

    }

    const onSuccess = (err, result) => {
        if(err){
            let errorMessage = errorHandler(err)

            MySwal.fire({
                icon: 'error',
                title: t("errorTitle"),
                text: t(errorMessage),
                confirmButtonText: t('OK'),
                confirmButtonColor: primary,
            })
            return 
        }
        if(result?.authorize_uri){
            window.location = result.authorize_uri
        }else{
            MySwal.fire({
                icon: 'success',
                title: t("successTitle"),
                text: t("Payment Success"),
                confirmButtonText: t('OK'),
                confirmButtonColor: primary,
            }).then(()=>{
                window.location.href = "/transactions";
            })
        }
        
    }

    return (
        <Containner>
            {order.type == "product" && <>
                <div className='py-5'>
                    <Breadcrumbs items={[
                        {
                            label: "หน้าหลัก",
                            url: "/",
                        },
                        {
                            label: "สินค้ามงคล",
                            url: "/products",
                        },
                        {
                            label: order.product.name,
                            url: "#",
                        },
                    ]} />
                </div>
                <div className='mb-5'>
                    <LineEnd />
                </div>
                {order.type != "donation" &&
                    <PaymentDetail
                        order={order}
                    />}
            </>}
            {order.type == "package" && <>
                <div className='py-5'>
                    <Breadcrumbs items={[
                        {
                            label: "หน้าหลัก",
                            url: "/",
                        },
                        {
                            label: "ทำบุญออนไลน์",
                            url: "/e-merit",
                        },
                        {
                            label: order.product.name,
                            url: "#",
                        },
                    ]} />
                </div>
                <div className='mb-5'>
                    <LineEnd />
                </div>
                {order.type != "donation" &&
                    <PaymentDetail
                        order={order}
                    />}
            </>}
            {order.type == "donation" && <>
                <div className='py-5'>
                    <Breadcrumbs
                        items={[
                            {
                                label: "หน้าหลัก",
                                url: "/",
                            },
                            {
                                label: "สถานที่",
                                url: "#",
                            },
                            {
                                label: order.place?.highlightName || order.product.name,
                                url: "#",
                            },
                        ]}
                    />
                </div>
                <p className='text-xl font-medium'>รายละเอียดการบริจาค</p>
            </>}

            <div className="grid grid-cols-3 gap-4 pt-5">
                <div className='col-span-3'>
                    <LineEnd />
                    <div className='my-5'>
                        <p className='active text-primary text-xl mb-2'>วิธีการชำระเงิน *</p>
                        <p className='text-xs text-gray-400 mb-5'>กรุณาเลือกวิธีการชำระเงินของคุณ</p>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="โอนเงินเข้าบัญชี" value="1" />
                                        {order.type != "donation" && order.type != "product"  && <Tab label="บัตรเครดิต / เดบิต" value="2" />}
                                    </TabList>
                                </Box>
                                <TabPanel value="1" className='py-5 px-0'>

                                    {order.type == "donation" && order.place.bankAccounts.map((bankAccount, bankIndex) => <BankAccount key={bankIndex} data={bankAccount} />)}
                                    {order.type != "donation" && order.type != "product" && bankAccounts.map((bankAccount, bankIndex) => <BankAccount key={bankIndex} data={bankAccount} />)}

                                    <p className='text-xs text-gray-400'>* กรุณาโอนเงินภายใน 1 ชั่วโมง และเก็บสลิปการโอนเงินทุกครั้ง เพื่อนำมายืนยันกับเจ้าหน้าที่</p>

                                    <LineEnd className="mt-4" />

                                    <TransactionSlip order={order} onSuccess={onSuccess} />

                                </TabPanel>
                                {order.type != "donation" && order.type != "product" && <TabPanel value="2">

                                    <p>บัตรเครดิต / เดบิต</p>

                                    <Omise order={order} publicKey={omisePublicKey} onSuccess={onSuccess} />

                                </TabPanel>}
                            </TabContext>
                        </Box>
                    </div>
                </div>

                {/* <div className='col-span-3 sm:col-span-1 '>

                    {order.type != "donation" &&
                        <PaymentProductDetail
                            order={order}
                        />}
                    {order.type == "donation" &&
                        <PaymentDonationDetail order={order} customStyles={{ display: "none" }} />}

                </div>

                <div className='col-span-3 sm:col-span-2 sm:mr-20'>


                </div> */}
            </div>


        </Containner >
    )
}

export default OrderPayment

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
                destination: "/login"
            }
        }
    }

    let orderId = context.params.orderId

    API.init(session)

    let order = null
    let bankAccounts = []
    let omisePublicKey = null

    try {
        order = await API.getOrder(orderId)
        if (!order) {
            return {
                notFound: true
            }
        }
    } catch (error) {
        return {
            notFound: true
        }
    }

    if(order.paymentStatus != "pending"){
        return {
            redirect: {
                permanent: false,
                destination: "/transactions/" + orderId
            }
        }
    }

    let appConfig = null
    try {
        appConfig = await API.getAppCongfig()
        bankAccounts = appConfig.bankAccounts
        omisePublicKey = appConfig.omisePublicKey
    } catch (error) {
    }

    console.log(JSON.stringify(order, null, 2))

    return {
        props: {
            session,
            order,
            appConfig,
            bankAccounts,
            omisePublicKey
        },
    };
}