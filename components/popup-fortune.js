
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import styles from '../styles/Popup.module.scss'
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import { API } from '../service/apiService';
import * as moment from 'moment';
import { filterHtmlUtil } from '../utils/filterHtmlUtil';

export default function PopupFortune({ bgImage }) {

    const { data: session } = useSession()
    const [horoscope, setHoroscope] = useState(null)
    const [open, setOpen] = useState(false)

    useEffect(() => {

        if (session) {
            API.init(session)
            initFortune()
        }

    }, [session])

    function handleClose() {
        setOpen(false)
    }

    const initFortune = async () => {
        try {
            let now = moment().format('yyyy-MM-DD').toString();
            let isTrue = (localStorage.getItem('fortune') === now);

            if (!isTrue) {
                await getHoroscope()
                localStorage.setItem('fortune', now)
                setOpen(true)
            }
        } catch (error) {
            console.log(error)
        }
    }


    const getHoroscope = async () => {
        try {
            let horoscope = await API.getHoroscope({
            })
            if (horoscope) {
                setHoroscope(horoscope.detail)
            }
        } catch (error) {
            console.log("PopupFortune.getPopupFortuneHoroscope.error--->", error)
        }
    }

    let style = {}

    if (bgImage) {
        style = {
            backgroundImage: `url(${bgImage})`
        }
    }

    return (<Dialog
        open={open && horoscope != null}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"

    >
        <DialogContent className={styles.popupFortune}>
            <div className="grid place-items-center p-5 xs:h-[270px] sm:h-[410px]">
                <div className={styles.frameFortune} style={style}/>
                <div className="grid bg-white rounded-lg p-3 w-full">
                    <p className="text-md sm:text-2xl md:text-2xl text-primary">ทำนายดวงของคุณประจำวัน</p>
                    <p className="text-2xl sm:text-2xl md:text-4xl text-black">คำทำนายดวง</p>
                </div>
                <div className="text-left">
                    <p className="text-md sm:text-2xl md:text-4xl text-white" dangerouslySetInnerHTML={{ __html: filterHtmlUtil(horoscope) }}></p>
                </div>
            </div>
        </DialogContent>
    </Dialog>)
}