import React, { useState } from "react";
import styles from "../../styles/slides/MiniSlide.module.scss";
import SildeHeader from "./silde-header";
import Image from "next/image";
import { useWindowSize } from "../../utils/useWindowSize.hook";
import { screen2Xl, screenLg, screenMd, screenSm, screenXl } from "../../utils/variable";
import Link from "next/link";
import CheckCircleOutlineOutlinedIcon from "@mui/icons-material/CheckCircleOutlineOutlined";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";

function EventCard({ data, index, loading, option: _option }) {
    const option = {
        cardWidthPercent: 42,
        paddingVerticalPercent: 6,
        ratio: 5 / 3,
        ..._option
    };
    const size = useWindowSize();
    if (size.width < screenSm) {
        option.cardWidthPercent = 100;
    }
    if (size.width >= screenSm) {
        option.cardWidthPercent = 49.2;
    }
    if (size.width >= screenMd) {
        option.cardWidthPercent = 32.5;
    }
    if (size.width >= screenLg) {
        option.cardWidthPercent = 24;
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

function EventCardOnlineMerit({ data, index, loading }) {
    return (
        <a
            href={`/transactions/${data.id}`}
            className={"inline-block relative " + styles.eventCard}
        >
            {data.product?.coverImages &&
                data.product?.coverImages.map((o, k) => (
                    <img
                        key={k}
                        src={API.assetUrl(o.image.url)}
                        className={
                            "w-full rounded-xl " +
                            styles.eventImage +
                            (loading ? " animate-pulse " : "")
                        }
                    />
                ))}
            <div className={styles.cardDetail}>
                {/* <div className={styles.cardSubTitle}>{data.product?.name}</div> */}
                <h4
                    className={styles.cardTitleOnlineMerit}
                    dangerouslySetInnerHTML={{ __html: filterHtmlUtil(data.product?.fullname) }}
                ></h4>
                {typeof data.product?.description == "object" && (
                    <h4 className={styles.cardTitle2}>
                        {data.product?.description}
                    </h4>
                )}
                {typeof data.product?.description != "object" && (
                    <h4
                        className={styles.cardTitle2}
                        dangerouslySetInnerHTML={{
                            __html: filterHtmlUtil(data.product?.description),
                        }}
                    ></h4>
                )}
            </div>
        </a>
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
                styles.blankCardNew
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
                styles.eventCard +
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
    onlineMerit = false,
    option,
}) {
    const size = useWindowSize();
    const [translate, setTranslate] = React.useState(0);
    const [pages, setPages] = React.useState(0);
    const [translatePage, setTranslatePage] = React.useState(1);
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

    React.useEffect(() => {
        let _percent = 107;
        let perPage = 6;

        if (size.width < screen2Xl) {
            //screenXl
        }
        if (size.width < screenXl) {
            //screenLg
        }
        if (size.width < screenLg) {
            //screenMd
            _percent = 107;
            perPage = 6;
        }
        if (size.width < screenSm) {
            //screenSM
            _percent = 107.5;
            perPage = 3;
        }

        let pages = data.length > 0 ? Math.ceil(data.length / perPage) : 0;
        let lastItems = data.length > 0 ? data.length % perPage : 0;
        let lastItemWidth = lastItems > 0 ? perPage - lastItems : 0;
        let _translate =
            data.length > 0 ? (translatePage - 1) * _percent * -1 : 0;

        if (lastItemWidth > 0 && pages == translatePage) {
            let _itemPercent = _percent / perPage;
            _translate += lastItemWidth * _itemPercent;
        }

        if (data.length <= perPage) {
            _translate = 0;
        }

        setTranslate(_translate);
        setPages(pages);

        if (translatePage > pages) {
            setTranslatePage(pages);
        }
    }, [size, translatePage, data]);

    const onPrev = () => {
        // setTranslatePage(page => page - 1)
        controlledSwiper.slidePrev();
    };

    const onNext = () => {
        // setTranslatePage(page => page + 1)
        controlledSwiper.slideNext();

        console.log(controlledSwiper);
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
                                    styles.eventCardSwiperNew
                                }
                            >
                                {/* <EventCard data={item} key={key} index={key} loading={loading} /> */}
                                {data != undefined && onlineMerit == false && (
                                    <EventCard
                                        data={item}
                                        key={key}
                                        index={key}
                                        loading={loading}
                                        option={option}
                                    />
                                )}
                                {data != undefined && onlineMerit == true && (
                                    <EventCardOnlineMerit
                                        data={item}
                                        key={key}
                                        index={key}
                                        loading={loading}
                                    />
                                )}
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
