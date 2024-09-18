import { API } from '../../service/apiService';
import styles from '../../styles/booking/Booking.module.scss'
import LineEnd from '../line-end'

export default function BookingResult({props, order}) {

    let thumbnailImage = null

    if (order.product.coverImages) {
        let items = order.product.coverImages.filter(o=>o.type="pc").map(o => {
            // console.log(o);
            return API.assetUrl(o.image.url);
        })

        if(items.length > 0){
            thumbnailImage = items[0]
        }
    }

    return <div className={"rounded-lg drop-shadow-lg bg-white w-full relative "+styles.box}>
        <div className='p-5'>
            <div className='mb-5 text-center'>
                <p>รายการจองของคุณ</p>
            </div>
            <div className=''>
                <div className='grid grid-cols-5'>
                    <div className='col-span-2 px-2'>
                        {/* <img src='../images/e-merit/thumbs.png' /> */}
                        {thumbnailImage && <img src={thumbnailImage} className={styles.thumbnailImage}/>}
                    </div>
                    <div className='col-span-3 px-2'>
                        <p className='text-sm'>{order.product.place.templeName} • {order.product.place.province.name}</p>
                        <p className='text-[10px] text-gray-400 mb-2'>{order.product.name}</p>
                        <p className='text-xs'>ราคา <span className='text-primary'>{order.total}</span> บาท / ชุด</p>
                    </div>
                </div>
                <div className='my-5'>
                    <LineEnd />
                </div>
                
                <p className='mb-2 font-medium'>รายละเอียดราคา</p>
                <div className='grid grid-cols-2'>
                    <div>
                        <p className='text-sm mb-2'>ราคา {order.orderItem.promotionPrice} x {order.orderItem.qty} ชุด</p>
                        {/* <p className='text-sm mb-2'>VAT {order.vat}%</p> */}
                        <p className='text-sm text-primary'>รวมราคา</p>
                    </div>
                    <div className='text-right'>
                        <p className='text-sm mb-2'>{order.total}</p>
                        {/* <p className='text-sm mb-2'>{(order.total * 7 )/100}</p> */}
                        <p className='text-sm text-primary'>{order.total}</p>
                    </div>
                </div>
            </div>
        </div>
        
    </div>
}