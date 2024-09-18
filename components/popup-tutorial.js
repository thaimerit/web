
import Containner from "./containner";
import Image from 'next/image'
import footerLogo from '../public/images/logo-big-t.png'
import Link from 'next/link';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import styles from '../styles/Popup.module.scss'
import MySwiperPopup from "./my-swiper/my-swiper-popup";
import { useState } from "react";

export default function PopupTutorial({items, open, handleClose}) {

    return (<Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="responsive-dialog-title"
        
    >
        <DialogContent className={styles.popupSwaiper}>
            <div className={styles.swaiperContent}>
                <MySwiperPopup items={items} widthFull={false} imageClass="swiper-in-detail-page" />
            </div>
        </DialogContent>
    </Dialog>)
}