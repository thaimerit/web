import styles from '../../styles/payment/TransactionSlip.module.scss'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import ArrowCircleUpIcon from '@mui/icons-material/ArrowCircleUp';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { createRef, useEffect, useState } from 'react';
import Button from '../button/button';
import { errorHandler, withReactContent } from '../../utils/alertUtil';
import { t } from 'i18next';
import { primary } from '../../utils/variable';
import { API } from '../../service/apiService';
import * as moment from 'moment';

function SuccessButton({ image, onClick, loading, disabled }) {
    let dateText = moment(image.createdAt).add(543, "year").format("DD MMM YYYY HH:mm")
    return <>
        <div className='border border-gray-200 rounded w-full grid grid-cols-6 py-2 mt-5'>
            <div className='text-center'>
                <CheckCircleOutlineOutlinedIcon sx={[{ fontSize: 30 }, { color: '#61CC7F' }]} />
            </div>
            <div className='col-span-4 grid content-center'>
                <p className='text-sm'>{image.name} ({dateText})</p>
            </div>
            <div className='text-center'>
                {(!loading && !disabled) && <button type="button" onClick={onClick}>
                    <CancelOutlinedIcon sx={[{ fontSize: 30 }]} />
                </button>}
            </div>
        </div>

        <div className='border border-gray-200 rounded w-full p-2 mt-1 mb-5'>
            <img src={image.url} className="w-full" />
        </div>
    </>
}

function UploadButton({ onClick }) {
    return <button type="button" onClick={onClick} className='border border-gray-200 rounded w-full grid grid-cols-6 items-center py-2 my-5'>
        <div className='text-center'>
            <ArrowCircleUpIcon sx={[{ fontSize: 30 }, { color: '#ccc' }]} />
        </div>
        <div className='col-span-4 grid content-center'>
            <p className='text-sm'>อัพโหลดสลิปการโอนเงิน</p>
        </div>
    </button>
}

export function EvidenceOfAction({ order, onSuccess }) {

    const inputFileRef = createRef(null);
    const MySwal = withReactContent()
    const [loading, setLoading] = useState(false);
    const [images, setImages] = useState([]);

    useEffect(() => {

        if (order.evidenceOfActions) {
            setImages(order.evidenceOfActions)
        }

    }, [])

    const handleOnChangeFile = async (event) => {

        const newImage = event.target?.files?.[0];

        if (newImage) {

            setLoading(true)

            let photo = null
            try {
                photo = await API.uploadProfileImage(newImage)
                photo.url = API.assetUrl(photo.url)
                setImages(old => [...old, photo])
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

            try {
                await API.partnerOrder_AddEvidenceOfAction(order.id, photo.id)
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

            setLoading(false)

            // inputFileRef.current.value = null

        }

    }

    const onClickUploadFile = (e) => {

        e.preventDefault();
        inputFileRef.current.click();

    }

    const onClickDeleteFile = (image, key) => {

        MySwal.fire({
            icon: "info",
            title: t("Confirm Delete"),
            confirmButtonText: t("Delete"),
            cancelButtonText: t("Cancel"),
            confirmButtonColor: primary,
            showCancelButton: true,
        }).then(async (result) => {
            if (result.isConfirmed) {

                setLoading(true)

                try {

                    await API.partnerOrder_DeleteEvidenceOfAction(order.id, image.id)
                    let _images = [...images]
                    _images.splice(key, 1)
                    setImages(_images)
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

                setLoading(false)
            }
        })

    }

    return <div className=''>
        <div className='my-5'>

            {/* {!image && <UploadButton onClick={onClickUploadFile} />}
            {image && <SuccessButton image={image} onClick={onClickDeleteFile} />} */}

            {images.map((image, key) => <SuccessButton key={key} loading={loading} disabled={order.status != "approve"} image={image} onClick={e => onClickDeleteFile(image, key)} />)}

            <input
                ref={inputFileRef}
                accept="image/*"
                hidden
                type="file"
                onChange={handleOnChangeFile}
            />

        </div>

        {order.status == "approve" && <Button type="button" className="w-full mt-5 px-10 rounded linear-bg rounded" loading={loading} onClick={onClickUploadFile}>
            อัพโหลดรูปภาพ
        </Button>}

    </div>
}