import styles from '../../styles/transaction/PageItemCard.module.scss'
import { numberFormat } from '../../utils/numberFormat';
import moment from 'moment';
import Link from 'next/link';
import LineEnd from '../../components/line-end';
import Price from '../price';
import 'moment/locale/th'
moment.locale("th")

export default function PageItemCard({ className, data, loading }) {
    if (!loading) loading = false

    // console.log(data);
    function getProductName(orderItem, order) {
        if (order.type == "package" || order.type == "product") {
            let detail = null
            if (order.type == "package") {
                detail = <>
                    วันที่จอง {moment(orderItem.date).add(543, "year").format("DD MMMM YYYY")} {getPeriod(orderItem.period)}<br />
                    ราคา <Price price={orderItem.price} promotionPrice={orderItem.promotionPrice} /> บาท / ชุด
                </>
            } else
                if (order.type == "product") {
                    detail = <>ราคา <Price price={orderItem.price} promotionPrice={orderItem.promotionPrice} /> บาท / ชุด</>
                }


            return <>
                <div>{orderItem?.product?.fullname}</div>
                <div>{orderItem?.product?.place?.highlightName}</div>
                <div>{detail}</div>
            </>
        } else if (order.type == "donation") {

            return <>{orderItem.place.fullname}<br />{orderItem.place.templeName} {orderItem?.place?.province?.name}</>
        }
    }

    function getPartnerAcceptStatus(paymentStatus) {
        let paymentStatusList = {
            'pending': 'รอยืนยันรับงาน',
            'purchase': 'ชำระเงินแล้ว',
            'waiting-for-payment': 'รอเจ้าหน้าที่ยืนยัน',
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

    if(loading==true) return <a>
        <div className={'overflow-hidden rounded-md mb-4 p-2 '+styles.content}>
            <img className={"rounded-xl " + styles.image + " " + (loading ? " animate-pulse ": "")} />
        </div>
    </a>

    return <div className={className}>
        {data.orderItems.map((orderItem, orderKey) => <div key={orderKey} className="my-8 px-2">
            <div className="flex flex-row justify-between sm:align-middle sm:items-center ">
                <div className=''>
                    <div>เลขที่คำสั่งซื้อ #{data.id}</div>
                    <div>{orderItem?.product?.fullname}</div>
                    <div className="text-md font-bold">{getPartnerAcceptStatus(data.partnerAcceptStatus)}</div>
                    {/* <div>{moment(data.createdAt).add(543, "year").format("DD MMM YYYY")} | {moment(data.createdAt).locale("en").format("h:mm A")}</div> */}
                </div>
                <div className='text-right mt-0 md:mt-0'>
                    <div>วันที่ {moment(data.packageDate).add(543, "year").format("DD MMM YYYY")} ({getPeriod(orderItem.period)})</div>
                    <p>จำนวน {orderItem.qty}</p>
                    <Link href={`/liff/pending-orders/${data.id}`}>
                        <a className='text-md active text-primary'>ดูรายละเอียด</a>
                    </Link>
                </div>
            </div>
            <div className='mt-8'>
                <LineEnd />
            </div>
        </div>)}
    </div>
}