import styles from '../../styles/PageItemCard.module.scss'
import { numberFormat } from '../../utils/numberFormat';
import moment from 'moment';
import Link from 'next/link';
import LineEnd from '../../components/line-end';
import Price from '../price';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { API } from '../../service/apiService';
import { t } from 'i18next';
import ControlPointOutlinedIcon from '@mui/icons-material/ControlPointOutlined';
import DoDisturbOnOutlinedIcon from '@mui/icons-material/DoDisturbOnOutlined';
import { useEffect, useState, useMemo } from 'react';
import Button from '../button/button';
import { errorHandler, withReactContent } from '../../utils/alertUtil';
import { alertOkButtonColor, primary } from '../../utils/variable'
import { useRouter } from 'next/router';
import _ from 'lodash'

export default function PageItemCard({ className, item, loading, onDelete }) {

    console.log('order ',item);
    if (!item) {
        loading = true;
    }
    
    const router = useRouter();
    const MySwal = withReactContent();
    let [data, setData] = useState({
        total: 0,
        vatTotal: 0,
        sum: 0,
    })
    let [localLOading , setLocalLoading] = useState(false)
    let [disablePay , setDisablePay] = useState(false)
    let [qty , setQty] = useState(item?.orderItem.qty)

    let product = item?.product
    let orderItem = item?.orderItem

    let dateText = orderItem?.date ? moment(orderItem.date).add(543, "year").format("DD MMMM YYYY") : ""
    let period = orderItem?.period
    let vat = item?.vat

    let price = product?.price
    let thumbnailImage = null

    if (product?.coverImages) {
        let items = product?.coverImages.filter(o => o.type = "pc").map(o => {
            return API.assetUrl(o.image.url);
        })

        if (items.length > 0) {
            thumbnailImage = items[0]
        }
    }

    if (product?.promotionPrice) {
        price = product?.promotionPrice
    }
    const onChangeQty = (qty) => {
        setQty(qty)
    };
    function onMinus() {
        if (qty - 1 < 1) return
        setDisablePay(true)
        onChangeQty(qty - 1)
        debounceFun(qty - 1)
    }
    function onPlus() {
        setDisablePay(true)
        onChangeQty(qty + 1)
        debounceFun(qty + 1)
    }

    const debounceFun = useMemo(() => _.debounce(async function (qty) {
        try {
            setLocalLoading(true)
            const orderId = item?.id
            let result = await API.updateOrder(orderId, {
                qty
            })
            setLocalLoading(false)
            setDisablePay(false)
        } catch (error) {
            setLocalLoading(false)
            setDisablePay(false)
            let errorMessage = errorHandler(error)

            MySwal.fire({
                icon: 'error',
                title: t("errorTitle"),
                text: t(errorMessage),
                confirmButtonText: t('OK'),
                confirmButtonColor: primary,
            })
        }
    }, 500), []);

    // function onMinus(item) {
    //     if (qty - 1 < 1) return
    //     console.log('onMinus');
    //     console.log(item);
    //     console.log(qty);
    //     qty = qty - 1
    // }
    // function onPlus(item) {
    //     console.log('onPlus');
    //     console.log(item);
    //     qty = qty + 1
    // }

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

    const onSubmit = () => {
        const orderId = item?.id
        MySwal.fire({
            icon: "info",
            title: t("Confirm Payment"),
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: t("Confirm"),
            confirmButtonColor: primary,
            cancelButtonText: t("Cancel"),

        }).then(async (result) => {
            if (result.isConfirmed) {
                // console.log(data)
                loading = true
                try {
                    let result = await API.updateOrder(orderId, {
                        qty : qty,
                        status : "pending"
                    })
                    // console.log('result ', result );
                    router.push(`/orders/${result.id}/payment`)

                } catch (error) {

                    loading = false

                    let errorMessage = errorHandler(error)

                    MySwal.fire({
                        icon: 'error',
                        title: t("errorTitle"),
                        text: t(errorMessage),
                        confirmButtonText: t('OK'),
                        confirmButtonColor: primary,
                    })
                }
            }
        })
    };

    const deleteItem = () =>{
        const orderId = item?.id
        onDelete(orderId);
    }

    if (loading == true) return <div>
        <div className='overflow-hidden rounded-md mb-4'>
            <img className={"rounded-xl " + styles.image + " " + (loading ? " animate-pulse " : "")} style={{ height: "100px" }} />
        </div>
    </div>


    return <div className="grid grid-cols-12">
        <div className='col-span-12 sm:col-span-2 mr-5 my-2'>
            <div className={styles.thumbnailOrder}>
                {thumbnailImage && <img src={thumbnailImage} className={styles.thumbnailImageOrderCart} />}
            </div>
        </div>
        <div className='col-span-12 sm:col-span-4 ml-0 sm:ml-5 mb-5 sm:mb-0'>
            <p className='text-lg mb-2'>หมายเลขสั่งซื้อ {item.id}</p>
            {product?.name && <p className='text-lg mb-2'>{product?.name}</p>}
            {product?.place?.highlightName && <p className='text-sm text-gray-400 mb-2'>{product?.place?.highlightName}</p>}
            {item.type == "package" && <p className='text-sm text-gray-400 mb-2'>วันที่ {dateText} ({t(period)})</p>}
        </div>
        <div className='col-span-12 sm:col-span-2 ml-0 sm:ml-5 mb-5 sm:mb-0'>
            <div className='flex justify-center h-full'>
                <div className='text-center grid content-center'>
                    <div className='text-center'>
                        {<button disabled={loading || localLOading} type="button" className={styles.controlBtn} onClick={onMinus}>
                            <DoDisturbOnOutlinedIcon />
                        </button>}
                    </div>
                </div>
                <div className='text-center grid content-center mx-3'>
                    <p className='text-lg text-primary m-auto'>{qty}</p>
                </div>
                <div className='text-center grid content-center'>
                    <div className='text-center'>
                        <button  disabled={loading || localLOading}  type="button" className={styles.controlBtn} onClick={onPlus}>
                            <ControlPointOutlinedIcon />
                        </button>
                    </div>
                </div>
            </div>
        </div>   
        <div className='col-span-12 sm:col-span-2 ml-0 sm:ml-5 mb-5 md:mb-0'>
            <div className='flex justify-center h-full'>
                <p className='text-lg text-primary m-auto'>{numberFormat(data.sum)}</p>
            </div>
        </div>  
        <div className='col-span-12 sm:col-span-2 ml-0 sm:ml-5 '>
            <div className='grid grid-cols-1 lg:grid-cols-2 h-full'>
                
                {disablePay == false && <div className='col-span-1 flex justify-center self-center mx-2'>
                    <Button onClick={deleteItem} loading={loading} className="text-xs md:text-sm  px-2 py-2 bg-gray-200 rounded h-[50px] w-full mb-2 md:mb-0">ลบ</Button>
                </div>}
                {disablePay == false && <div className='col-span-1 flex justify-center self-center mx-2'>
                    <Button onClick={onSubmit} loading={loading} className="text-xs md:text-sm px-2 py-2 rounded h-[50px] w-full">ชำระเงิน</Button>
                </div>}
                {disablePay == true && <div className='col-span-2 flex justify-center self-center mx-2'>
                    <Button loading={true} className="text-xs md:text-sm px-2 py-2 rounded h-[50px] w-full">กำลังโหลด</Button>
                </div>}
            </div>
        </div>  
    </div>
}