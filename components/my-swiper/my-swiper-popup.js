import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import styles from '../../styles/my-swiper/MySwiperPopup.module.scss'
import { Pagination, Navigation } from "swiper";
import CheckIcon from '@mui/icons-material/Check';

export default function MySwiper({ items, className, widthFull, customStyles, imageClass }) {
    // if(!imageClass) imageClass = ""

    return <Swiper
        loop={true}
        loopFillGroupWithBlank={true}
        pagination={{
            clickable: true,
        }}
        // navigation={true}
        modules={[Pagination, Navigation]}
        className={(widthFull == true ? styles.swiperFull : styles.swiper)+" rounded-xl"}
        >
        {
            items.map((item, key) => 
                <SwiperSlide key={key} >
                    <div className="p-5 h-[450px]">
                        <div className="grid place-content-center my-2">
                            <img src="/images/popup/logo.png" className={styles.logo}></img>
                        </div>
                        <div className="grid place-content-center mb-8">
                            <p className="text-3xl font-medium text-white">ทำบุญออนไลน์</p>
                        </div>
                        <div className="grid place-items-center grid-cols-4 bg-white rounded-lg p-3 mb-8 relative">
                            <div className="absolute -top-4 -right-4 bg-primary w-8 h-8 rounded-full grid place-content-center">
                                <CheckIcon className="text-center text-white" />
                            </div>
                            <div className="col-span-1 ">
                                <div className="rounded-full border-8 border-gray-100 w-16 h-16 flex justify-center">
                                    <p className="text-4xl text-primary">{key+1}</p>
                                </div>
                            </div>
                            <div className="col-span-3">
                                <p className="text-2xl text-black">{item.title}</p>
                            </div>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl text-white">{item.description}</p>
                        </div>
                    </div>
                </SwiperSlide>
            )
        }
    </Swiper>
}