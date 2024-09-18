import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import styles from "../styles/Popup.module.scss";
import { useEffect, useState } from "react";
import Link from "next/link";
import { API } from "../service/apiService";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Pagination, Navigation } from "swiper";
import { screenLg } from "../utils/variable";
import { useWindowSize } from "../utils/useWindowSize.hook";

export default function PopupPromotion({ items, open, handleClose, bgImage }) {
    const windowSize = useWindowSize();
    const [size, setSize] = useState({
        width: null,
        height: null,
    });
    const [lastIndex, setLastIndex] = useState(0);

    useEffect(() => {
        initData();
    }, []);

    useEffect(() => {
        let height = 450
        if(windowSize.width < screenLg){
            height = 280
        }
        let image = items[lastIndex].image;
        let ratio = height / image.height;
        let size = {
            width: image.width * ratio,
            height: image.height * ratio
        };
        setSize(size);
    }, [windowSize.width, lastIndex]);

    function initData() {}

    function onChangeSwiper(e) {
        try {
            if (items[e.realIndex]) {
                setLastIndex(e.realIndex)
                // let height = 450
                // if(windowSize.width < screenLg){
                //     height = 350
                // }
                // let image = items[e.realIndex].image;
                // let ratio = height / image.height;
                // let size = {
                //     width: image.width * ratio,
                // };
                // setSize(size);
            }
        } catch (error) {}
    }

    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="responsive-dialog-title"
        >
            <DialogContent
                className={styles.popupPromotion}
                style={{ width: size.width+20, height: size.height+20 }}
            >
                {/* {items.map((item, key)=><Link key={key} href="/e-merit" >
                <a onClick={handleClose}>
                    <div className="grid place-items-center">
                        <img src={API.assetUrl(item.image.url)} className={styles.logo}></img>
                    </div>
                </a>
            </Link>)} */}

                <Swiper
                    onSlideChange={onChangeSwiper}
                    loop={true}
                    loopFillGroupWithBlank={true}
                    navigation={items.length > 1}
                    pagination={{
                        clickable: true,
                    }}
                    modules={[Pagination, Navigation]}
                    style={{ height: "100%" }}
                >
                    
                    {items.map((item, key) => (
                        <SwiperSlide
                            style={{
                                height: "100%",
                                justifyContent: "center",
                                display: "flex",
                                // width: 450,
                                // height: 450,
                            }}
                            key={key}
                        >
                            {bgImage && <div style={{ 
                                    // backgroundImage: 'url(./images/chinese_frame.png)', 
                                    // backgroundSize: "cover",
                                    position: 'absolute', 
                                    width: size.width+20, 
                                    height: size.height+20,
                                    zIndex: 10,
                                    width: "100%",
                                    height: "100%"
                                }} 
                            ><img src={bgImage ? bgImage : "/images/chinese_frame.png"} style={{
                                width: "100%",
                                height: "100%"
                            }}/></div>}
                            <a
                                href={item.url ? item.url : "#"}
                                target={item.open}
                                className={styles.image}
                                style={{ marginTop:0}}
                            >
                                <img
                                    src={API.assetUrl(item.image.url)}
                                    className={styles.image}
                                ></img>
                            </a>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </DialogContent>
        </Dialog>
    );
}
