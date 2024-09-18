import React from "react";
import styles from "../../styles/CoverSlide.module.scss";
import { Swiper, SwiperSlide } from "swiper/react";
import { EventSectionItem } from "../event-section/event-section-item";

export default function CoverSlide({
    data,
    option,
    loading,
    onSwiper,
    itemRender,
}) {
    if (!option) {
        option = {
            paddingVerticalPercent: 6,
            ratio: 5 / 3,
        };
    }

    return (
        <div
            className={styles.slider}
            style={{ padding: `0 ${option.paddingVerticalPercent}%` }}
        >
            <Swiper
                pagination={{
                    clickable: true,
                }}
                slidesPerView={"auto"}
                className={"w-full rounded-xl"}
                onSwiper={onSwiper}
            >
                {!loading &&
                    data.map((item, key) => (
                        <SwiperSlide key={key} className={styles.swiperSlide}>
                            {itemRender(item, key)}
                        </SwiperSlide>
                    ))}
            </Swiper>
        </div>
    );
}
