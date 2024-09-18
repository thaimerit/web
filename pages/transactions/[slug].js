import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import Booking from '../../components/booking/booking'
import BookingResult from '../../components/booking/bookingResult'
import Breadcrumbs from '../../components/breadcrumbs'
import Containner from '../../components/containner'
import Fortune from '../../components/fortune/fortune'
import LineEnd from '../../components/line-end'
import MySwiper from '../../components/my-swiper/my-swiper'
import PageTitle from '../../components/page-title'
import TimelapseIcon from '@mui/icons-material/Timelapse';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { getSession } from 'next-auth/react'
import { checkUserActive } from '../../utils/authUtil'
import { API } from '../../service/apiService'
import { data } from 'autoprefixer'
import { PaymentDonationDetail } from '../../components/payment/paymentDonationDetail'
import { PaymentProductDetail } from '../../components/payment/paymentProductDetail'
import moment from 'moment'
import { filterHtmlUtil } from '../../utils/filterHtmlUtil'

function Pending({ session, order }) {

    const router = useRouter()
    console.log('order----------->', order);

    function getPaymentStatus(paymentStatus) {
        let paymentStatusList = {
            'pending': 'รอการโอนเงิน',
            'purchase': 'ชำระเงินแล้ว',
            'cancel': 'ยกเลิก',
            'complete': 'เสร็จสมบูรณ์'
        }

        return paymentStatusList[paymentStatus]
    }

    return (
        <Containner>
            <div className='py-5'>
                <Breadcrumbs items={[
                    {
                        label: "หน้าหลัก",
                        url: "#",
                    },
                    {
                        label: "รายการสั่งซื้อ",
                        url: "#",
                    },
                ]} />
            </div>
            <p className='text-xl font-medium'>{getPaymentStatus(order.paymentStatus)}</p>
            <Breadcrumbs color="text-gray-500" items={[
                {
                    label: order.product?.place?.templeName,
                    url: "#",
                },
                {
                    label: order.product?.place?.province?.name,
                    url: "#",
                },
                {
                    label: order.product.name,
                    url: "#",
                }
            ]} />


            <div className="grid grid-cols-3 gap-4 pt-5">

                <div className='col-span-3 sm:col-span-2 sm:mr-20 '>
                    <div className='mb-5'>
                        <LineEnd />
                    </div>
                    {order.status != "complete" && <div className='grid h-80 text-center place-content-center'>

                        {/* <div className='justify-self-center rounded-full border-8 border-zinc-200 border-[#32CD32] w-20 h-20 mb-5'> */}
                        <div className='justify-self-center rounded-full border-8 border-zinc-200 w-20 h-20 mb-5'>
                            <div className='grid h-full place-content-center '>
                                {/* <TimelapseIcon sx={[{fontSize: 50},{color: '#F68C29'}]} /> */}
                                {
                                    (order.paymentStatus == 'purchase' ? <CheckCircleIcon sx={[{ fontSize: 50 }, { color: '#32CD32' }]} /> :
                                        (order.paymentStatus == 'waiting-for-payment' ? <TimelapseIcon sx={[{ fontSize: 50 }, { color: '#F68C29' }]} /> :
                                            <CancelIcon sx={[{ fontSize: 50 }, { color: '#FF0000' }]} />))
                                }

                            </div>
                        </div>

                        {/* <p className='active text-primary text-xl mb-1'>รอการยืนยันจากเจ้าหน้าที่ </p>
                        <p className=''>การชำระเงินของคุณอยู่ระหว่างการตรวจสอบ</p> */}

                        {
                            order.status !== 'complete' &&
                            (order.paymentStatus == 'purchase' ? <p className=''>คำสั่งซื้อของท่านได้รับการชำระเงินแล้วอยู่ระหว่างการดำเนินการ</p> :
                                (order.paymentStatus == 'waiting-for-payment' ? <p className=''>การชำระเงินของคุณอยู่ระหว่างการตรวจสอบ</p> :
                                    <p className=''>คำสั่งซื้อของท่านได้ถูกยกเลิก</p>))

                        }
                        {
                            order.status == 'complete' &&
                            <p className={'active text-primary text-xl mb-1 ' + (order.paymentStatus == 'purchase' ? 'text-[#50d71e]' : 'text-[#FF0000]')}>
                                {getPaymentStatus(order.status)}
                            </p>
                        }

                        {order.status == "complete" && <div className='mt-4 text-center text-xl text-[#50d71e]'>เจ้าหน้าที่ได้ดำเนินการคำสั่งของคุณเรียบร้อยแล้ว</div>}

                    </div>
                    }
                    {order.status != "complete" && order.payment?.paymentMethod == "bank" && <div>
                        <div className='mb-10'><LineEnd /></div>
                        <div className='text-xl font-semibold'>ช่องทางการชำระเงิน</div>
                        <div className='grid grid-cols-1 gap-4 pt-5'>
                            {!order.payment && <div className="rounded-xl border h-60 border-gray-400 bg-gray-200 text-gray-500 flex justify-center align-middle items-center">ไมมีข้อมูล</div>}
                            {

                                order.payment && <div div className='mb-10'>
                                    {
                                        order.payment.banks.map((o, k) =>
                                            <div key={k}>
                                                <p className='mb-2'>ชื่อบัญชี <span className='text-primary'>{o.account}</span></p>
                                                <p className='mb-2'>เลขที่บัญชี <span className='text-primary'>{o.no}</span></p>
                                                <p className='mb-2'>ธนาคาร <span className='text-primary'>{o.bank.name}</span></p>
                                            </div>
                                        )
                                    }
                                    <p className='mb-2'>วันที่ทำรายการ <span className='text-primary'>{moment(order.payment.createdAt).add(543, "year").format("DD MMMM YYYY HH:MM")}</span></p>

                                    {order.payment.transferSlip && <div className='my-5'>
                                        <img src={API.assetUrl(order.payment.transferSlip)} className="rounded-xl border border-gray-400" />
                                    </div>
                                    }
                                </div>
                                // console.log(order.payment.creditCard)
                            }
                        </div>
                    </div>}
                    {order.status != "complete" && order.payment?.paymentMethod == "creditCard" && <div className='mb-10'>
                        <div className='mb-10'><LineEnd /></div>
                        <div className='text-xl font-semibold'>ช่องทางการชำระเงิน</div>
                        <div className='grid grid-cols-1 gap-4 pt-5'>
                            {!order.payment.creditCard && <div className="rounded-xl border h-60 border-gray-400 bg-gray-200 text-gray-500 flex justify-center align-middle items-center">ไมมีข้อมูล</div>}
                            {
                                order.payment.creditCard && <div>
                                    <p className='text-xl font-medium mb-2'>Credit / Debit Card</p>
                                    <p className='font-medium text-primary mb-2'>{order.payment.creditCard.bank}</p>
                                    <p className='mb-2'>วันที่ทำรายการ <span className='text-primary'>{moment(order.payment.createdAt).add(543, "year").format("DD MMMM YYYY  HH:MM")}</span></p>
                                    <p className='mb-2'>เลขที่อ้างอิง <span className='text-primary'>{order.payment.transaction}</span></p>
                                </div>
                                // console.log(order.payment.creditCard)
                            }
                        </div>
                    </div>}

                    {order.status == "complete" && <div className='mb-10'>
                        <div className='text-xl font-semibold mb-2'>ชื่อผู้ขอพร</div>
                        <p className="text-primary" >{order.customer_name ? order.customer_name : ''}</p>
                    </div>}

                    {order.status == "complete" && <div className='mb-10'>
                        <div className='text-xl font-semibold mb-2'>คำอธิฐาน</div>
                        <p className="text-primary" dangerouslySetInnerHTML={{ __html: filterHtmlUtil(order.orderItem.prayword) }}></p>
                    </div>}

                    {order.status == "complete" && <div>
                        <div className='text-xl font-semibold mb-2'>หลักฐานการทำบุญ</div>
                        <p className='mb-2'>วันที่ทำรายการ <span className='text-primary'>{moment(order.updatedAt).add(543, "year").format("DD MMMM YYYY  HH:MM")}</span></p>
                        <div className='grid grid-cols-1 gap-4 pt-5'>
                            {!order.evidenceOfActions && <div className="rounded-xl border h-60 border-gray-400 bg-gray-200 text-gray-500 flex justify-center align-middle items-center">ไมมีข้อมูล</div>}
                            {
                                order.evidenceOfActions && order.evidenceOfActions.map((o, k) =>


                                    <img key={k} src={API.assetUrl(o.url)} className="rounded-xl border border-gray-400" />


                                    // console.log(API.assetUrl(o.url));
                                )
                            }
                        </div>

                        <div style={{marginTop: "30px"}}>
                            <span className='text-primary underline'><Link href={'/places/' + order.product?.place.id}><a>เคล็ดลับเพิ่มเติมตั้งจิตอธิฐาน ไปยังหลักฐานการทําบุญ และสวดภาวนาตามบทสวดดังนี้</a></Link></span>
                        </div>
                    </div>}
                </div>
                <div className='col-span-3 sm:col-span-1 order-first sm:order-last'>
                    {/* <BookingResult order={order} /> */}
                    {order.type != "donation" &&
                        <PaymentProductDetail
                            order={order}
                        />}
                    {order.type == "donation" &&
                        <PaymentDonationDetail order={order} customStyles={{ display: "none" }} />}
                </div>
            </div>


        </Containner>
    )
}

export default Pending

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

    let slug = context.params.slug

    API.init(session)
    let order = null

    try {
        order = await API.getOrder(slug)
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

    // ถ้ายังชำระเงินไม่เสร็จให้ไปหน้าจ่ายเงิน
    if (order.paymentStatus == "pending") {
        return {
            redirect: {
                permanent: false,
                destination: "/orders/" + slug + "/payment"
            }
        }
    }

    return {
        props: {
            session,
            order
        },
    };
}