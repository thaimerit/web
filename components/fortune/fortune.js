import React, { useState } from "react";
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import Button from "../button/button";
import { primary } from "../../utils/variable";
import { getRandomInt } from "../../utils/getRandomInt";
import { filterHtmlUtil, filterHtmlUtilHolystick } from "../../utils/filterHtmlUtil";
import styles from "../../styles/Fortune.module.scss";

const style = {
    borderRadius: "20px",
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    // width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    textAlign: "center"
};

const styleNumber = {
    border: "10px solid #dfae6a",
    borderRadius: "50% 50%",
    width: "100px",
    height: "100px",
    display: "flex",
    justifyContent: "center",
    alignContent: "center",
    alignItems: "center",
    color: "#FFF",
    fontSize: "30px"
}

export default function Fortune({ data, className }) {
    const [loading, setLoading] = useState(false)
    const [open, setOpen] = useState(false);
    const [yourFortune, setYourFortune] = useState(null);

    function fortune() {
        setLoading(true)
        setTimeout(() => {

            let index = getRandomInt(1, data.predictions.length)

            let yourFortune = data.predictions[index - 1]
            yourFortune.description = removeHtml(yourFortune.description);
            console.log(yourFortune);
            setYourFortune(yourFortune)

            setOpen(true)
            setLoading(false)
        }, 2000)
    }

    const handleClose = () => {
        setOpen(false);
    };

    const removeHtml = (description) => {
        return description.replace(/<br\s*\/?>/gi,' ');
    }

    return <><div className="text-center">
        <img src="/images/e-fortune/e-fortune-2.png" className="m-auto w-40" />
        <div className="font-bold mt-4">อธิษฐานก่อนเขย่า</div>
        <Button className="mt-4" onClick={fortune} loading={loading}>เสี่ยงเซียมซีออนไลน์</Button>
    </div>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={{ ...style }} className={styles.box}>
                <h2 id="child-modal-title">ใบที่</h2>
                <div className="flex justify-center py-4">
                    <div style={styleNumber}>
                        {yourFortune?.number}
                    </div>
                </div>
                <div id="child-modal-description">
                    <div >{data.place?.highlightName}</div>
                    <div className="py-4 text-white">คำทำนาย</div>
                    {/* <div dangerouslySetInnerHTML={{__html: yourFortune?.description}}></div> */}
                    
                    <div className="grid justify-items-center">
                        <div className="indent-8 whitespace-pre-line text-white"  dangerouslySetInnerHTML={{__html: filterHtmlUtilHolystick(yourFortune?.description)}}></div>
                    </div>
                    <Button className="px-8 mt-4" onClick={handleClose}>ปิด</Button>
                </div>

            </Box>
        </Modal>
    </>
}