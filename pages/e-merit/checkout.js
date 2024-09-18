import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Booking from '../../components/booking/booking'
import BookingCheckout from '../../components/booking/bookingCheckout'
import Breadcrumbs from '../../components/breadcrumbs'
import Containner from '../../components/containner'
import Fortune from '../../components/fortune/fortune'
import LineEnd from '../../components/line-end'
import MySwiper from '../../components/my-swiper/my-swiper'
import PageTitle from '../../components/page-title'
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { Box, Tab, TextareaAutosize, TextField } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Button from '../../components/button/button'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Omise from '../../components/omise'
import { getSession } from 'next-auth/react'
import { checkUserActive } from '../../utils/authUtil'
import { API } from '../../service/apiService'
import { errorHandler, withReactContent } from '../../utils/alertUtil'
import { alertOkButtonColor, danger, primary } from '../../utils/variable'
import { t } from 'i18next'
import Error from 'next/error'
import { alpha, styled } from '@mui/material/styles';
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
import { signIn } from "next-auth/react";

function CheckOut({ session, product, appConfig }) {

    const router = useRouter()
    const MySwal = withReactContent();
    const { productId, date, period } = router.query
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('1');
    const [amount, setAmount] = useState(2200);
    const [data, setData] = useState({
        "productId": productId,
        date,
        period,
        "qty": 1,
        "prayword": ""
    })
    const [customerName, setCustomerName] = useState('');

    useEffect(() => {
        if(!session){
            signIn()
            return
        }
        API.init(session)
        initData()
    }, [])

    const initData = async () => {
        console.log(product)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onChangePrayword = (e) => {
        setData(old => ({ ...old, prayword: e.target.value }))
    };

    const onChangeCustomerName = (e) => {
        setCustomerName(e.target.value)
    };

    const onChangeQty = (qty) => {
        setData(old => ({ ...old, qty }))
    };

    const onSubmit = () => {

        MySwal.fire({
            icon: "info",
            title: t("Confirm Booking"),
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: t("Confirm"),
            confirmButtonColor: primary,
            cancelButtonText: t("Cancel"),

        }).then(async (result) => {
            if (result.isConfirmed) {
                // console.log(data)
                setLoading(true)
                try {
                    let result = await API.createOrder({
                        orderItems: [data],
                        type: "package",
                        customer_name: customerName
                    })

                    router.push(`/carts`)
                    // router.push(`/orders/${result.id}/payment`)

                    // MySwal.fire({
                    //     icon: 'success',
                    //     title: t("Create Booking Success"),
                    //     confirmButtonText: t('OK'),
                    //     confirmButtonColor: alertOkButtonColor,
                    // }).then(() => {
                    //     router.push(`/orders/${result.id}/payment`)
                    // })
                } catch (error) {

                    setLoading(false)

                    let errorMessage = errorHandler(error)

                    MySwal.fire({
                        icon: 'error',
                        title: t("errorTitle"),
                        text: t(errorMessage),
                        confirmButtonText: t('OK'),
                        confirmButtonColor: primary,
                    })

                }

            }
        })

    };

    if(!session){
        return <></>
    }

    return (
        <Containner>
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
                        label: product.fullname,
                        url: "/packages/" + product.id,
                    },
                    {
                        label: "รายละเอียดการสั่งจอง",
                        url: "#",
                    },
                ]} />
            </div>
            <p className='text-xl font-medium'>รายละเอียดการสั่งจอง</p>
            {product.place && <Breadcrumbs color="text-gray-500" items={[
                {
                    label: product.place?.templeName,
                    url: "#",
                },
                {
                    label: product.place?.province?.data?.attributes?.name,
                    url: "#",
                },
                {
                    label: product.fullname,
                    url: "#",
                }
            ]} />}

            {!product.place && <Breadcrumbs color="text-gray-500" items={[
                {
                    label: "ทำบุญออนไลน์",
                    url: "#",
                },
                {
                    label: product.fullname,
                    url: "#",
                }
            ]} />}

            <div className="grid grid-cols-3 gap-4 pt-5">
                <div className='col-span-3 md:col-span-2 md:mr-20'>
                    <LineEnd />
                    <div className='my-5'>
                        <p className='active text-primary text-xl mb-5'>ชื่อผู้ขอพร</p>
                        <div className="my-5">
                            <TextField
                                className="w-full"
                                placeholder="ชื่อนามสกุลของคุณ"
                                // label="ชื่อนามสกุลของคุณ"
                                name="address"
                                variant="outlined"
                                value={customerName}
                                onChange={onChangeCustomerName}
                                disabled={loading}
                                color="primary"
                            />
                        </div>
                        <p className='active text-primary text-xl mb-5'>คำอธิษฐานขอพรจากคุณ</p>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            placeholder="เขียนคำอธิษฐานขอพรของคุณ"
                            minRows={15}
                            style={{ width: "100%", border: "1px solid #c4c4c4", borderRadius: "10px", padding: "10px" }}
                            value={data.prayword}
                            onChange={onChangePrayword}
                            disabled={loading}
                            
                        />
                    </div>
                    {/* <LineEnd /> */}
                </div>

                <div className='col-span-3 md:col-span-1 '>
                    <BookingCheckout
                        product={product}
                        qty={data.qty}
                        date={date}
                        period={period}
                        onChangeQty={onChangeQty}
                        onSubmit={onSubmit}
                        vat={appConfig?.vat}
                        loading={loading}
                    />
                </div>

            </div>


        </Containner>
    )
}

export default CheckOut

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    // if (!session) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: "/login"
    //         }
    //     }
    // }

    let productId = context.query.productId

    API.init(session)
    let product = null
    try {
        let result = await API.getProductById(productId)
        product = result.attributes
    } catch (error) {
        return {
            notFound: true
        }
    }


    if (product.type != "package") {
        return {
            notFound: true
        }
    }

    let appConfig = await API.getAppCongfig()

    return {
        props: {
            session,
            product,
            appConfig
        },
    };
}