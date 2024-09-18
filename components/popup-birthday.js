
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import styles from '../styles/Popup.module.scss'
import { useEffect, useState } from "react";
import { useSession } from 'next-auth/react';
import * as moment from 'moment';
import { API } from '../service/apiService';

export default function PopupBirthday() {

    const { data: session } = useSession()
    const [open, setOpen] = useState(false)

    useEffect(() => {
        if (session) {
            API.init(session)
            // initBirthday()
        }
    }, [session])

    const initBirthday = async () => {
        try {
            let result = await API.getProfile();
            let user = result.data;

            let now = moment().format('yyyy-MM-DD').toString();

            if (user.dateOfBirth === now) {
                let isTrue = (localStorage.getItem('birthday') === now);
                if (!isTrue) {
                    localStorage.setItem('birthday', now)
                    setOpen(true)
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    function handleClose() {
        setOpen(false)
    }

    return (<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"

    >
        <DialogContent className={styles.popupBirthDay}>
            <div className="grid place-items-center p-5 h-[400px]">
                <div className="grid bg-white rounded-lg p-3 w-full">
                    <p className="text-4xl text-black text-center">สุขสันต์วันเกิด</p>
                </div>
                <div className="text-center">
                    <p className="text-2xl text-white">"อายุ วัณโณ สุขัง พลัง"</p>
                    <p className="text-1xl text-white">"... ขอให้เจริญด้วยอายุ วรรณะ สุขะ พละ ..."</p>
                </div>
            </div>
        </DialogContent>
    </Dialog>)
}