import styles from '../../styles/booking/Booking.module.scss'
import LineEnd from '../line-end'
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import Link from 'next/link';
import { numberFormat } from '../../utils/numberFormat';

export function PaymentDonationDetail({props, order, customStyles}) {
    return <div className={"rounded-lg drop-shadow-lg bg-white w-full relative "+styles.box}>
        <div className='p-5'>
            <div className='mb-5 text-center'>
                <p>รายละเอียดการบริจาค</p>
            </div> 
            <div className=''>

                <div className='my-5'>
                    <LineEnd />
                </div>
                {console.log(order)}
                <p className='mb-2 font-medium'>รายละเอียดบริจาค</p>
                <div className='grid grid-cols-2 mb-5'>
                    <div>
                        <p className='text-sm mb-2'>จำนวนเงิน</p>
                        <p className='text-sm text-primary'>รวมจำนวนเงิน</p>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm mb-2'>{numberFormat(order.sum)}</p>
                        <p className='text-sm text-primary'>{numberFormat(order.total)}</p>
                    </div>
                </div>
                <div className='mb-5 text-center' style={customStyles}>
                    <Link href={`/e-donation/payment`} >
                        <a type='button' className='rounded-full text-white  py-4 px-5 bg-primary py-2 px-5'>ชำระเงิน</a>
                    </Link>
                </div>
            </div>
        </div>
        
    </div>
}