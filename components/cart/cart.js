import { TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment/locale/th'
import Link from 'next/link';
import { useState } from 'react';
import styles from '../../styles/cart/Cart.module.scss'
import Button from '../button/button';
import LineEnd from '../line-end'
import Price from '../price';
moment.locale("th")
export default function Cart({ product }) {

    const [date, setDate] = useState(null)

    return <LocalizationProvider dateAdapter={AdapterMoment}>

        <div className={"mt-5 rounded-lg drop-shadow-md bg-white w-full relative p-4 " + styles.box}>
            <div className='mb-5'>
                <p className='text-xl'> {product.name} {product.place?.templeName} <Price price={product?.price} promotionPrice={product?.promotionPrice} /> บาท / ชุด</p>
            </div>
            <div className=''>
                <div className='text-center self-center'>
                    <Link href={`/products/checkout?productId=${product.id}`} >
                        <a type='button' className='rounded-full text-white  py-4 px-5 bg-primary py-2 px-5 w-full'>สั่งจองสินค้ามงคล</a>
                    </Link>
                </div>
            </div>
        </div>
    </LocalizationProvider>
}