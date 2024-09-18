import styles from '../../styles/booking/Booking.module.scss'
import LineEnd from '../line-end'
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import Price from '../price';
import { numberFormat } from '../../utils/numberFormat';
import { useEffect, useState } from 'react';
import * as moment from 'moment';
import { t } from 'i18next';
import Button from '../button/button';
import { API } from '../../service/apiService';
import 'moment/locale/th'
moment.locale("th")

export function PaymentProductDetail({ order, vat, qty, onChangeQty }) {

    let [data, setData] = useState({
        total: 0,
        vatTotal: 0,
        sum: 0,
    })

    let product = order.product
    let orderItem = order.orderItem

    let dateText = orderItem.date ? moment(orderItem.date).add(543, "year").format("DD MMMM YYYY") : ""
    let period = orderItem.period

    let price = product.price
    let thumbnailImage = null

    if (product.coverImages) {
        let items = product.coverImages.filter(o => o.type = "pc").map(o => {
            return API.assetUrl(o.image.url);
        })

        if (items.length > 0) {
            thumbnailImage = items[0]
        }
    }

    if (product.promotionPrice) {
        price = product.promotionPrice
    }

    if (qty === undefined) qty = 1
    if (vat === undefined) vat = 7

    function _onChangeQty() {
        if (onChangeQty) {
            onChangeQty(1)
        }
    }

    function onMinus() {
        if (qty - 1 < 1) return
        onChangeQty(qty - 1)
    }
    function onPlus() {
        onChangeQty(qty + 1)
    }

    useEffect(() => {

        let total = (price * qty).toFixed(2)
        let vatTotal = (total * (vat / 100)).toFixed(2)
        let sum = total //((+total) + (+vatTotal)).toFixed(2)

        setData({
            total,
            vatTotal,
            sum
        })
    }, [qty])

    let vatTotal = (order.total * (order.vat / 100)).toFixed(2)

    return <div className={"rounded-lg drop-shadow-lg bg-white w-full relative " + styles.boxOrder}>
        <div className='p-5'>
            <div className='mb-5 text-center'>
                <p>{order.type == "package" ? "รายการคำสั่งซื้อ" : "รายการสินค้ามงคล"}</p>
            </div>
            <div className='mb-5 '>
                <p>หมายเลขสั่งซื้อ {order.id}</p>
            </div>
            <div className=''>
                <div className='grid grid-cols-5'>
                    <div className='col-span-2 px-2'>
                        <div className={styles.thumbnailOrder}>
                            {thumbnailImage && <img src={thumbnailImage} className={styles.thumbnailImageOrder} />}
                        </div>
                    </div>
                    <div className='col-span-3 px-2'>
                        <p className='text-xl mb-2'>{product?.name}</p>
                        <p className='text-sm text-gray-400 mb-2'>{product?.place?.highlightName}</p>
                        {order.type == "package" && <p className='text-sm text-gray-400 mb-2'>วันที่ {dateText} ({t(period)})</p>}
                        <div className='flex justify-content-end'>
                            <p className='text-xl'>ยอดโอน <span className='text-primary'>{order.total}</span> บาท</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </div>
}