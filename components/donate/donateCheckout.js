import styles from '../../styles/booking/Booking.module.scss'
import LineEnd from '../line-end'
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import Link from 'next/link';
import { TextField } from '@mui/material';
import Button from '../button/button';
import { numberFormat } from '../../utils/numberFormat';
import { useState } from 'react';

let prices = [100, 200, 300, 400, 500, 900, 1000, 2000, 3000]

export default function DonateCheckout({ props, customStyles, price, onChangePrice, loading, onSubmit, disabled }) {

    let [selectPrice, setSelectPrice] = useState(false)

    function onClickPrice(price) {
        onChangePrice(price)
    }
    function onChangeTextPrice(e) {
        onChangePrice(e.target.value)
    }
    function onClickSelectPrice(e) {
        setSelectPrice(old=>!old)
    }


    return <div className={"rounded-lg drop-shadow-lg bg-white w-full relative " + styles.box}>
        <div className='p-5'>
            <div className='mb-5 text-center'>
                <p>เลือกจำนวนเงินสำหรับบริจาค</p>
            </div>
            <div className=''>

                <div className='my-5'>
                    <LineEnd />
                </div>

                {!selectPrice && <div>
                    {prices.map((p, key) => <Button key={key} type="button" className={'mr-3 mb-3  px-3 py-2 rounded-xl ' + (price == p ? "bg-primary text-white" : "bg-gray-100 text-black")} onClick={e => onClickPrice(p)}>
                        <span >{numberFormat(p)}</span>
                    </Button>)}
                </div>}

                <div>
                    {!selectPrice && <Button onClick={onClickSelectPrice} loading={loading} className="px-8 py-2 text-sm">กำหนดจำนวนเงินเอง</Button>}
                    {selectPrice && <Button onClick={onClickSelectPrice} loading={loading} className="px-8 py-2 text-sm">เลือกจำนวนเงิน</Button>}
                </div>

                <div className='mt-8'>
                    <TextField
                        className="w-full text-right"
                        label="จำนวนเงิน"
                        name="price"
                        type="number"
                        disabled={!selectPrice}
                        value={price}
                        variant="outlined"
                        onChange={onChangeTextPrice}
                    />
                </div>

                <div className='mt-4 text-center'>
                    <Button onClick={onSubmit} loading={loading} disabled={disabled} className="px-8 py-2">ชำระเงิน</Button>
                </div>
            </div>
        </div>

    </div>
}