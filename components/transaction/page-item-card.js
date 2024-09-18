import styles from '../../styles/PageItemCard.module.scss'
import { numberFormat } from '../../utils/numberFormat';
import moment from 'moment';
import Link from 'next/link';
import LineEnd from '../../components/line-end';
import Price from '../price';

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
                <div className='font-bold'>{orderItem?.product?.name}</div>
                <div>{orderItem?.product?.place?.highlightName}</div>
                <div>{detail}</div>
            </>
        } else if (order.type == "donation") {

            return <>{orderItem.place.fullname}<br />{orderItem.place.templeName} {orderItem?.place?.province?.name}</>
        }
    }

    function getPaymentStatus(paymentStatus) {
        let paymentStatusList = {
            'pending': 'รอการโอนเงิน',
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

    return <div className={className}>

        {data.orderItems.map((orderItem, orderKey) => <div key={orderKey} className="mb-8">
            <div className="flex flex-col md:flex-row md:justify-between md:align-middle md:items-center">
                <div className=''>
                    {getProductName(orderItem, data)}
                    <div className="font-bold">{getPaymentStatus(data.paymentStatus)}</div>
                    <div>{moment(data.createdAt).add(543, "year").format("DD MMM YYYY")} | {moment(data.createdAt).locale("en").format("h:mm A")}</div>
                </div>
                <div className='md:text-right mt-4 md:mt-0'>
                    <p>{numberFormat(data.total)} ฿</p>
                    <p>จำนวน {orderItem.qty}</p>
                    <Link href={`/transactions/${data.id}`}>
                        <a className='active text-primary'>ดูรายละเอียด</a>
                    </Link>
                </div>
            </div>
            <div className='mt-8'>
                <LineEnd />
            </div>
        </div>)}
    </div>
}