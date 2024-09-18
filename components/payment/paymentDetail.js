import styles from '../../styles/PageItemCard.module.scss'
import { numberFormat } from '../../utils/numberFormat';
import moment from 'moment';
import Link from 'next/link';
import LineEnd from '../line-end';
import Price from '../price';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { primary } from '../../utils/variable';
import { API } from '../../service/apiService';
import { t } from 'i18next';

export default function PaymentDetail({ className, order, loading }) {
    if (!loading) loading = false

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

    if (loading == true) return <div>
        <div className='overflow-hidden rounded-md mb-4'>
            <img className={"rounded-xl " + styles.image + " " + (loading ? " animate-pulse " : "")} style={{ height: "100px" }} />
        </div>
    </div>


    return <div className="grid grid-cols-6">
        <div className='col-span-6 sm:col-span-1 mr-5 my-2'>
            <div className={styles.thumbnailOrder}>
                {thumbnailImage && <img src={thumbnailImage} className={styles.thumbnailImageOrder} />}
            </div>
        </div>
        <div className='col-span-6 sm:col-span-3 ml-0 sm:ml-5'>
            <p className='text-lg mb-2'>หมายเลขสั่งซื้อ {order.id}</p>
            {product?.name && <p className='text-lg mb-2'>{product?.name}</p>}
            {product?.place?.highlightName && <p className='text-sm text-gray-400 mb-2'>{product?.place?.highlightName}</p>}
            {order.type == "package" && <p className='text-sm text-gray-400 mb-2'>วันที่ {dateText} ({t(period)})</p>}
        </div>
        <div className='col-span-6 sm:col-span-1 ml-0 sm:ml-5'>
            <div className='flex justify-center h-full'>
                <p className='text-lg text-primary m-auto'>{order.orderItem.qty}</p>
            </div>
        </div>
        <div className='col-span-6 sm:col-span-1 ml-0 sm:ml-5'>
            <div className='flex justify-center h-full'>
                <p className='text-lg text-primary m-auto'>{order.total}</p>
            </div>
        </div>
    </div>
}