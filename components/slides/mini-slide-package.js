import React, { useState } from "react";
import styles from "../../styles/slides/MiniSlidePackage.module.scss";
import SildeHeader from "./silde-header";
import Image from "next/image";
import { useWindowSize } from "../../utils/useWindowSize.hook";
import Link from "next/link";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { screenMd, screenSm } from "../../utils/variable";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";

function EventCard({ data, index, loading }) {
    const option = {
        cardWidthPercent: 42,
        paddingVerticalPercent: 6,
        ratio: 5 / 3,
    };
    const size = useWindowSize();
    if (size.width < screenSm) {
        option.cardWidthPercent = 100;
    }
    const width =
        ((size.width -
            size.width * ((option.paddingVerticalPercent / 100) * 2)) *
            option.cardWidthPercent) /
        100;
    const height = width ? width / option.ratio : 0;

    return (
        <Link href={data.url}>
            <a
                href={data.url}
                className={"inline-block relative " + styles.eventCardNew}
            >
                <div
                    className={
                        "w-full rounded-xl " +
                        styles.eventImage +
                        (loading ? " animate-pulse " : "")
                    }
                >
                    <img
                        src={data.thumbnail}
                        className={
                            "w-full rounded-xl " +
                            styles.eventImage +
                            (loading ? " animate-pulse " : "")
                        }
                        style={{
                            height,
                        }}
                    />
                    {data.status == "complete" && (
                        <div className={styles.eventCardNewComplete}>
                            <div className={styles.eventCardNewCompleteWrapper}>
                                <CheckCircleOutlineOutlinedIcon
                                    sx={[
                                        { fontSize: 80 },
                                        { color: "#61CC7F" },
                                    ]}
                                />
                                <div style={{ fontSize: 18, color: "#61CC7F" }}>
                                    จบงานแล้ว
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <div className={styles.cardDetail}>
                    <div className={styles.cardSubTitle}>{data.subTitle}</div>
                    <h4
                        className={styles.cardTitle}
                        dangerouslySetInnerHTML={{ __html: filterHtmlUtil(data.title) }}
                    ></h4>
                    {typeof data.description == "object" && (
                        <h4 className={styles.cardTitle2}>
                            {data.description}
                        </h4>
                    )}
                    {typeof data.description != "object" && (
                        <h4
                            className={styles.cardTitle2}
                            dangerouslySetInnerHTML={{
                                __html: filterHtmlUtil(data.description),
                            }}
                        ></h4>
                    )}
                </div>
            </a>
        </Link>
    );
}

function BlankCard({ text }) {
    if (text == undefined) text = "คุณยังไม่มีรายการ";
    return (
        <div
            className={
                "rounded-xl inline-block relative bg-gray-200 text-center " +
                styles.eventCardNew +
                " " +
                styles.blankCard
            }
        >
            <div className={styles.blankCardText}>{text}</div>
        </div>
    );
}

function BlankCardSearch({ text }) {
    if (text == undefined) text = "ไม่พบรายการที่ท่านค้นหา";
    return (
        <div
            className={
                "rounded-xl inline-block relative bg-gray-200 text-center " +
                styles.eventCardNew +
                " " +
                styles.blankCard
            }
        >
            <div className={styles.blankCardText}>{text}</div>
        </div>
    );
}

export default function MiniSlideNew({
    className,
    title,
    data,
    emptyText,
    customStyles,
    customHeader,
    loading,
    showAll,
    search = false,
}) {
    const [controlledSwiper, setControlledSwiper] = useState(null);

    if (loading) {
        data = [
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
            {
                id: null,
                thumbnail: null,
                title: "",
                subTitle: "",
                description: "",
                url: "",
            },
        ];
    }

    const onPrev = () => {
        controlledSwiper.slidePrev();
    };

    const onNext = () => {
        controlledSwiper.slideNext();
    };

    return (
        <div className={className}>
            <SildeHeader
                title={title}
                onPrev={onPrev}
                loading={loading}
                onNext={onNext}
                canPrev={true}
                canNext={true}
                customSlideHeader={customStyles}
                customHeader={customHeader}
                showAll={showAll}
            />
            <div className="overflow-hidden">
                <div className={styles.slider} style={customStyles}>
                    <Swiper
                        pagination={{
                            clickable: true,
                        }}
                        slidesPerView={"auto"}
                        className={"w-full " + styles.sliderComponent}
                        onSwiper={setControlledSwiper}
                    >
                        {data.map((item, key) => (
                            <SwiperSlide
                                key={key}
                                className={
                                    "inline-block relative " +
                                    styles.eventCardSwiper
                                }
                            >
                                <EventCard
                                    data={item}
                                    key={key}
                                    index={key}
                                    loading={loading}
                                />
                            </SwiperSlide>
                        ))}

                        {(data == undefined || data.length == 0) && (
                            <SwiperSlide
                                className={
                                    "inline-block relative " +
                                    styles.eventCardSwiper
                                }
                            >
                                {search == false && (
                                    <BlankCard text={emptyText} />
                                )}
                                {search == true && (
                                    <BlankCardSearch text={emptyText} />
                                )}
                            </SwiperSlide>
                        )}
                    </Swiper>
                </div>
            </div>
        </div>
    );
}
