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

export default function CartCheckout({ product, vat, qty, onChangeQty, onSubmit, date, period, loading }) {

    let [data, setData] = useState({
        total: 0,
        vatTotal: 0,
        sum: 0,
    })

    let dateText = date ? moment(date).add(543, "year").format("DD MMMM YYYY") : ""

    let price = product.price
    let thumbnailImage = null

    if (product.coverImages) {
        let items = product.coverImages.filter(o=>o.type="pc").map(o => {
            return API.assetUrl(o.image.data.attributes.url);
        })

        if(items.length > 0){
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
        let sum = total//((+total) + (+vatTotal)).toFixed(2)

        setData({
            total,
            vatTotal,
            sum
        })
    }, [qty])

    return <div className={"rounded-lg drop-shadow-lg bg-white w-full relative " + styles.box}>
        <div className='p-5'>
            <div className='mb-5 text-center'>
                <p>รายละเอียดการสั่งจอง</p>
            </div>
            <div className=''>
                <div className='grid grid-cols-5'>
                    <div className='col-span-2 px-2'>
                        <div className={styles.thumbnail}>
                            {thumbnailImage && <img src={thumbnailImage} className={styles.thumbnailImage}/>}
                        </div>
                    </div>
                    <div className='col-span-3 px-2'>
                        <p className='text-sm'>{product?.fullname}</p>
                        <p className='text-[10px] text-gray-400 mb-2'>{product?.place?.templeName} • {product?.place?.province?.data?.attributes?.name}</p>
                        <p className='text-xs'>ราคา <Price price={product?.price} promotionPrice={product?.promotionPrice} /> บาท / ชุด</p>
                    </div>
                </div>

                <div className='my-5'>
                    <LineEnd />
                </div>
                <p className='mb-2 font-medium'>จำนวนสินค้ามงคลที่ต้องการ</p>
                <div className='grid grid-cols-5'>
                    <div className='col-span-3'>
                        <p className='mb-2 font-medium '>จำนวน</p>
                        <p className='text-xs mb-2'>{product?.fullname} {product?.place?.province?.data?.attributes?.name}</p>
                    </div>
                    <div className='col-span-2 grid grid-cols-3'>
                        <div className='text-center grid content-center'>
                            <div className='text-center'>
                                {<button disabled={loading} type="button" className={styles.controlBtn} onClick={onMinus}>
                                    <DoDisturbOnOutlinedIcon />
                                </button>}
                            </div>
                        </div>
                        <div className='text-center grid content-center'>
                            <p>{qty}</p>
                        </div>
                        <div className='text-center grid content-center'>
                            <div className='text-center'>
                                <button disabled={loading} type="button" className={styles.controlBtn} onClick={onPlus}>
                                    <ControlPointOutlinedIcon />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='my-5'>
                    <LineEnd />
                </div>

                <p className='mb-2 font-medium'>รายละเอียดราคา</p>
                <div className='grid grid-cols-2'>
                    <div>
                        <p className='text-sm mb-2'>ราคา <Price price={product?.price} promotionPrice={product?.promotionPrice} /> x {qty} ชุด</p>
                        {/* <p className='text-sm mb-2'>VAT {vat}%</p> */}
                        <p className='text-lg text-primary'>รวมราคา</p>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm mb-2'>{numberFormat(data.total)}</p>
                        {/* <p className='text-sm mb-2'>{numberFormat(data.vatTotal)}</p> */}
                        <p className='text-lg text-primary'>{numberFormat(data.total)}</p>
                    </div>

                </div>
                <div className='mt-5 text-center'>
                    <Button onClick={onSubmit} loading={loading} className="px-8 py-2">ขั้นตอนต่อไป</Button>
                    {/* <button type='button' onClick={onSubmit} className='rounded-full text-white  py-4 px-5 bg-primary py-2 px-5'>ชำระเงิน</button> */}
                </div>
            </div>
        </div>

    </div>
}