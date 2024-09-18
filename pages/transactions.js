import React, { useEffect, useState } from 'react';
import { TextField } from '@mui/material';
import Button from '../components/button/button';
import Image from 'next/image';
import styles from '../styles/pages/Profile.module.scss'
import Containner from '../components/containner';
import LineEnd from '../components/line-end';
import SocialButton from '../components/button/social-button';
import Breadcrumbs from '../components/breadcrumbs';
import { Box, Tab, TextareaAutosize } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Booking from '../components/booking/booking';
import MySwiper from '../components/my-swiper/my-swiper';
import ProfileSideBar from '../components/profile/profile-sidebar';
import { getSession } from 'next-auth/react';
import { checkUserActive } from '../utils/authUtil';
import { API } from '../service/apiService';
import Link from 'next/link';
import { numberFormat } from '../utils/numberFormat';
import moment from 'moment';
import PageItemsPaginate from '../components/transaction/page-items-paginate';

export default function Transactions({ session }) {
    const [items, setItems] = useState([])
    const [active, setActive] = useState({
        id: 1,
        value: "pending",
        name: "รอการโอนเงิน"
    })
    const [paymentStatus, setPaymentStatus] = useState([
        {
            id: 1,
            value: "pending",
            name: "รอการโอนเงิน"
        },
        {
            id: 4,
            value: "waiting-for-payment",
            name: "รอเจ้าหน้าที่ยืนยัน"
        },
        {
            id: 2,
            value: "purchase",
            name: "ชำระเงินแล้ว"
        },
        {
            id: 5,
            value: "complete",
            name: "สำเร็จ"
        },
        {
            id: 3,
            value: "cancel",
            name: "ยกเลิก"
        },
    ])

    useEffect(() => {
        API.init(session)
        initData()
    }, [])

    async function initData() {
        // ALL
        let result = await API.getOrders({});
        let items = result.data
        setItems(items)

        // //ตัวอย่างการดึงแต่ละประเภท
        // let pendingOrders = await API.getOrders({
        //     'filters[paymentStatus]': 'pending'
        // });

        // let waitingForPaymentOrders = await API.getOrders({
        //     'filters[paymentStatus]': 'waiting-for-payment'
        // });

        // let purchaseOrders = await API.getOrders({
        //     'filters[paymentStatus]': 'purchase'
        // });

        // let calcelOrders = await API.getOrders({
        //     'filters[paymentStatus]': 'cancel'
        // });

        // let completeOrders = await API.getOrders({
        //     'filters[status]': 'complete'
        // });

        // console.log({
        //     pendingOrders,
        //     waitingForPaymentOrders,
        //     purchaseOrders,
        //     calcelOrders,
        //     completeOrders,
        // })
    }


    const onClickPaymentType = (active, key) => {
        setActive(active);
    };

    // const getOrders = async (status) => {
    //     // console.log('status---->', status);
    //     let result = await API.getOrders({
    //         'filters[paymentStatus]': status
    //     });
    //     let items = result.data
    //     // console.log('items---->',items);
    //     setItems(items)
    // }

    function getProductName(orderItem, order) {
        if (order.type == "package" || order.type == "product") {
            let detail = null
            if (order.type == "package") {
                detail = <>วันที่จอง {moment(orderItem.date).add(543, "year").format("DD MMMM YYYY")} {getPeriod(orderItem.period)}</>
            }

            return <>{orderItem?.product?.fullname}<br />{orderItem?.product?.place?.fullname}<br />{detail}</>
        } else if (order.type == "donation") {

            return <>{orderItem.place.fullname}<br />{orderItem.place.templeName} {orderItem?.place?.province?.name}</>
        }
    }

    function getPaymentStatus(paymentStatus) {
        let paymentStatusList = {
            'pending': 'รอการโอนเงิน',
            'purchase': 'ชำระเงินแล้ว',
            'cancel': 'ยกเลิก',
        }

        return paymentStatusList[paymentStatus]
    }

    function getPeriod(period) {
        let periods = {
            'morning': 'ช่วงเช้า',
            'evening': 'ช่วงบ่าย',
        }

        return periods[period]
    }
    // const handleChange = (event, newValue) => {
    //     setValue(newValue);
    // };

    function getParams(active) {
        if (!active) return {}
        if (active.value == "complete") {
            return {
                "filters[status]": active?.value
            }
        }
        return {
            "filters[paymentStatus]": active?.value
        }
    }


    return (
        <Containner>
            <div className='py-4'>
                <Breadcrumbs items={[
                    {
                        label: "หน้าหลัก",
                        url: "/",
                    },
                    {
                        label: "บัญชีของฉัน",
                        url: "/profile",
                    }
                ]} />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">
                <div className="col-span-4 sm:col-span-1">
                    <ProfileSideBar active="transactions" />
                </div>

                <div className='col-span-4 sm:col-span-3'>
                    {
                        paymentStatus && <div className='flex flex-wrap text-center'>
                            {
                                paymentStatus.map((r, key) =>
                                    <Button type="button" className={'mr-3 mb-3  px-3 py-2 rounded-xl ' + ((active?.value == r.value) ? "bg-primary text-white" : "bg-gray-100 text-black")} key={key} onClick={e => onClickPaymentType(r, key)}>
                                        <span >{r.name}</span>
                                    </Button>
                                )
                            }
                        </div>
                    }
                    <div className='detail'>
                        <h3 className='title mb-8'>{active?.name}</h3>
                        <PageItemsPaginate apiUrl={"/users/me/orders"} className={"mb-5"} params={getParams(active)}/>
                        {/* {
                            items.filter(o => o.paymentStatus == active.value).map((item, index) => {
                                return item.orderItems.map((orderItem, orderKey) => <div key={orderKey} className="mb-8">
                                    <div className="flex flex-col md:flex-row md:justify-between md:align-middle md:items-center">
                                        <div className=''>
                                            <p>{getProductName(orderItem, item)}</p>
                                            <div className="font-bold">{getPaymentStatus(item.paymentStatus)}</div>
                                        </div>
                                        <div className='md:text-right mt-4 md:mt-0'>
                                            <p>{numberFormat(item.sum)} ฿</p>
                                            <p>จำนวน {orderItem.qty}</p>
                                            <Link href={`/transactions/${item.id}`}>
                                                <a className='active text-primary'>ดูรายละเอียด</a>
                                            </Link>
                                        </div>
                                    </div>
                                    <div className='mt-8'>
                                        <LineEnd />
                                    </div>
                                </div>)
                            })} */}
                    </div>
                </div>
            </div>
        </Containner >
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

    return {
        props: {
            session
        },
    };
}
