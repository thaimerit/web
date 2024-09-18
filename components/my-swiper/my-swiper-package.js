import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from '../../styles/my-swiper/MySwiperPackage.module.scss'
import { Pagination, Navigation } from "swiper";

export default function MySwiper({ items, className, widthFull, customStyles, imageClass }) {
    if(!imageClass) imageClass = ""
    return <Swiper
        loop={true}
        loopFillGroupWithBlank={true}
        pagination={{
            clickable: true,
        }}
        navigation={true}
        modules={[Pagination, Navigation]}
        className={(widthFull == true ? styles.swiperFull : styles.swiper)+" rounded-xl"}>
        {/* {items.map((item, key) => <SwiperSlide key={key} className={styles.swiperSlide}><img src={item}  style={customStyles} className={styles.swiperSlideImg + " " + imageClass} /></SwiperSlide>)} */}
        {items.map((item, key) => <SwiperSlide key={key} className={styles.swiperSlide}><div className={styles.swiperSize} style={{ backgroundImage: `url(${item})`, backgroundSize: "cover", backgroundPosition: "center center", width: "100%"  }}></div></SwiperSlide>)}
    </Swiper>
}