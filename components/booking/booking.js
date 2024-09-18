import { TextField } from '@mui/material';
import { LocalizationProvider, MobileDatePicker } from '@mui/x-date-pickers'

import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import moment from 'moment';
import 'moment/locale/th'
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from '../../styles/booking/Booking.module.scss'
import Button from '../button/button';
import LineEnd from '../line-end'
import Price from '../price';
moment.locale("th")
export default function Booking({ product }) {

    const [date, setDate] = useState(moment())

    useEffect(()=>{
        if (date.date() == moment().date() && parseInt(moment().format('HH')) > 13) {
            setDate(moment().add(1, 'days'));
        }
    },[])

    return <LocalizationProvider dateAdapter={AdapterMoment}>

        <div className={"rounded-lg drop-shadow-md bg-white w-full relative p-4 " + styles.box}>
            <div className='mb-5'>
                <p className='text-xl'> {product.name} <Price price={product?.price} promotionPrice={product?.promotionPrice} /> บาท / ชุด</p>
            </div>
            <div className='mb-5'>
                <MobileDatePicker
                    label="เลือกวันที่"
                    inputFormat="DD/MM/yyyy"
                    value={date}
                    name="date"
                    onChange={value => setDate(value)}
                    renderInput={(params) => <TextField className="w-full" {...params} />}
                />
            </div>
            {date != null && <>
                {
                    date.date() == moment().date() && parseInt(moment().format('HH')) < 9  && <>
                        <div className='mb-5'>
                            <div className='grid grid-cols-2'>
                                <div>
                                    
                                    <p className='font-bold'>{date.clone().add(543, "year").format("DD MMMM YYYY")}</p>
                                    <p>รอบเช้า</p>
                                </div>
                                <div className='text-center self-center'>
                                    <Link href={`/e-merit/checkout?productId=${product.id}&date=${date.clone().format("YYYY-MM-DD")}&period=morning`} >
                                        <a type='button' className='rounded-full text-white  py-4 px-5 bg-primary py-2 px-5'>จองทำบุญ</a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {
                    date > moment() && <>
                        <div className='mb-5'>
                            <div className='grid grid-cols-2'>
                                <div>
                                    
                                    <p className='font-bold'>{date.clone().add(543, "year").format("DD MMMM YYYY")}</p>
                                    <p>รอบเช้า</p>
                                </div>
                                <div className='text-center self-center'>
                                    <Link href={`/e-merit/checkout?productId=${product.id}&date=${date.clone().format("YYYY-MM-DD")}&period=morning`} >
                                        <a type='button' className='rounded-full text-white  py-4 px-5 bg-primary py-2 px-5'>จองทำบุญ</a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {
                    date.date() == moment().date() && parseInt(moment().format('HH')) < 13  &&  <>
                        <div className='mb-5'>
                            <LineEnd />
                        </div>
                        <div className='mb-5'>
                            <div className='grid grid-cols-2'>
                                <div>
                                    <p className='font-bold'>{date.clone().add(543, "year").format("DD MMMM YYYY")}</p>
                                    <p>รอบบ่าย</p>
                                </div>
                                <div className='text-center self-center'>

                                    <Link href={`/e-merit/checkout?productId=${product.id}&date=${date.clone().format("YYYY-MM-DD")}&period=evening`} >
                                        <a type='button' className='rounded-full text-white  py-4 px-5 bg-primary py-2 px-5'>จองทำบุญ</a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                }
                {
                    date > moment()  &&  <>
                        <div className='mb-5'>
                            <LineEnd />
                        </div>
                        <div className='mb-5'>
                            <div className='grid grid-cols-2'>
                                <div>
                                    <p className='font-bold'>{date.clone().add(543, "year").format("DD MMMM YYYY")}</p>
                                    <p>รอบบ่าย</p>
                                </div>
                                <div className='text-center self-center'>

                                    <Link href={`/e-merit/checkout?productId=${product.id}&date=${date.clone().format("YYYY-MM-DD")}&period=evening`} >
                                        <a type='button' className='rounded-full text-white  py-4 px-5 bg-primary py-2 px-5'>จองทำบุญ</a>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </>
                }
            </>}
        </div>
    </LocalizationProvider>
}