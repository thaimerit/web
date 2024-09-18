import styles from '../../styles/payment/TransactionSlip.module.scss'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { createRef, useState } from 'react';
import Button from '../button/button';
import { errorHandler, withReactContent } from '../../utils/alertUtil';
import { t } from 'i18next';
import { primary } from '../../utils/variable';
import { API } from '../../service/apiService';

function SuccessButton({ image, onClick }) {
    return <>
        <div className='border border-gray-200 rounded w-80 grid grid-cols-6 py-2 mt-5'>
            <div className='text-center'>
                <CheckCircleOutlineOutlinedIcon sx={[{ fontSize: 30 }, { color: '#61CC7F' }]} />
            </div>
            <div className='col-span-4 grid content-center'>
                <p className='text-sm'>ใบสลิปการโอนเงิน</p>
            </div>
            <div className='text-center'>
                <button type="button" onClick={onClick}>
                    <CancelOutlinedIcon sx={[{ fontSize: 30 }]} />
                </button>
            </div>
        </div>

        <div className='border border-gray-200 rounded w-80 p-2 mt-1 mb-5'>
            <img src={image} className="w-full" />
        </div>
    </>
}

function UploadButton({ onClick }) {
    return <button type="button" onClick={onClick} className='border border-gray-200 rounded w-80 grid grid-cols-6 items-center py-2 my-5'>
        <div className='text-center'>
            <ArrowCircleUpIcon sx={[{ fontSize: 30 }, { color: '#ccc' }]} />
        </div>
        <div className='col-span-4 grid content-center'>
            <p className='text-sm'>อัพโหลดสลิปการโอนเงิน</p>
        </div>
    </button>
}

export function TransactionSlip({ order, onSuccess }) {

    const inputFileRef = createRef(null);
    const MySwal = withReactContent()
    const [loading, setLoading] = useState(false);
    const [image, setImage] = useState(null);

    const handleOnChangeFile = (event) => {

        const newImage = event.target?.files?.[0];

        if (newImage) {

            setImage(URL.createObjectURL(newImage));

        }

    }

    const onClickUploadFile = (e) => {

        e.preventDefault();
        inputFileRef.current.click();

    }

    const onClickDeleteFile = (e) => {

        MySwal.fire({
            icon: "info",
            title: t("Confirm Delete Slip"),
            confirmButtonText: t("Delete"),
            cancelButtonText: t("Cancel"),
            confirmButtonColor: primary,
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {
                inputFileRef.current.value = null
                setImage(null)
            }
        })

    }

    const onSubmit = async () => {
        if (!image) {
            return MySwal.fire({
                icon: "error",
                title: t("Please Upload Slip"),
                confirmButtonText: t("OK"),
                confirmButtonColor: primary,
            })
        }

        setLoading(true)

        try {
            let photo = await API.uploadProfileImage(inputFileRef.current?.files?.[0])
            await API.orderPaymentBank(order.id, photo.id)

            if (onSuccess) onSuccess()

        } catch (error) {
            let errorMessage = errorHandler(error);

            MySwal.fire({
                icon: "error",
                title: t("errorTitle"),
                text: t(errorMessage),
                confirmButtonText: t("OK"),
                confirmButtonColor: primary,
            });
        }

    }

    return <div className=''>
        <div className='my-5'>
            <p className='active text-primary text-xl mb-2'>ส่งสลิปการโอนเงินเพื่อยืนยัน</p>
            <p className='text-xs text-gray-400 mb-2'>กรุณาเลือกรูปใบสลิปการโอนเงินและอัพโหลดเข้าระบบ</p>

            {!image && <UploadButton onClick={onClickUploadFile} />}
            {image && <SuccessButton image={image} onClick={onClickDeleteFile} />}

            <input
                ref={inputFileRef}
                accept="image/*"
                hidden
                type="file"
                onChange={handleOnChangeFile}
            />

            <p className='active text-xs text-primary text-xl mb-2'>อัพโหลดสลิปการโอนเงินแล้ว</p>
            <p className='text-xs text-gray-400'>กรุณากดปุ่ม ลูกศรกากบาท เพื่อยกเลิกและต้องการอัพโหลดสลิปโอนเงินใหม่</p>
        </div>
        <Button type="button" className="my-10 px-10" onClick={onSubmit} loading={loading} disabled={!image}>
            ยืนยันการโอนเงิน
        </Button>
    </div>
}