import React, { useState } from 'react';
import styles from '../../styles/slides/MiniSlideDetail.module.scss'
import SildeHeader from './silde-header'
import Image from 'next/image'
import { useWindowSize } from '../../utils/useWindowSize.hook';
import { screen2Xl, screenLg, screenSm, screenXl } from '../../utils/variable';
import Link from 'next/link';
import { filterHtmlUtil } from '../../utils/filterHtmlUtil';

function EventCard({ data, index, loading }) {
    return <a href={data.url} className={'inline-block relative ' + styles.eventCard}>
        <img src={data.thumbnail} className={"w-full rounded-xl " + styles.eventImage + (loading ? " animate-pulse ": "")} />
        <div className={styles.cardDetail}>
            <div className={styles.cardSubTitle}>{data.subTitle}</div>
            <h4 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: filterHtmlUtil(data.title) }}></h4>
            <h4 className={styles.cardTitle2} dangerouslySetInnerHTML={{ __html: filterHtmlUtil(data.description) }}></h4>
        </div>
    </a>
}

function BlankCard({ text }) {
    if (text == undefined) text = "คุณยังไม่มีรายการ"
    return <div className={'rounded-xl inline-block relative bg-gray-200 text-center ' + styles.eventCard + " " + styles.blankCard}>
        <div className={styles.blankCardText}>{text}</div>
    </div>
}

export default function MiniSlide({ className, title, data, emptyText, customStyles, customHeader, loading }) {

    const size = useWindowSize();
    const [translate, setTranslate] = React.useState(0)
    const [pages, setPages] = React.useState(0)
    const [translatePage, setTranslatePage] = React.useState(1)

    if (loading) {
        data = [{
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
        }, {
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
        }, {
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
        }]
    }

    React.useEffect(() => {
        let _percent = 107
        let perPage = 6

        if (size.width < screen2Xl) {
            //screenXl
        }
        if (size.width < screenXl) {
            //screenLg
        }
        if (size.width < screenLg) {
            //screenMd
            _percent = 107
            perPage = 6
        }
        if (size.width < screenSm) {
            //screenSM
            _percent = 107.5
            perPage = 3
        }

        let pages = data.length > 0 ? Math.ceil(data.length / perPage) : 0
        let lastItems = data.length > 0 ? data.length % perPage : 0
        let lastItemWidth = lastItems > 0 ? perPage - lastItems : 0
        let _translate = data.length > 0 ? (translatePage - 1) * _percent * -1 : 0

        if (lastItemWidth > 0 && pages == translatePage) {
            let _itemPercent = _percent / perPage
            _translate += lastItemWidth * _itemPercent
        }

        if(data.length <= perPage){
            _translate = 0
        }

        setTranslate(_translate)
        setPages(pages)

        if (translatePage > pages) {
            setTranslatePage(pages)
        }

    }, [size, translatePage, data])

    const onPrev = () => {
        setTranslatePage(page => page - 1)
    }

    const onNext = () => {
        setTranslatePage(page => page + 1)
    }

    return <div className={className}>
        <SildeHeader title={title} onPrev={onPrev} loading={loading} onNext={onNext} canPrev={translatePage > 1} canNext={translatePage < pages && pages > 1} customSlideHeader={customStyles} customHeader={customHeader} />
        <div className={styles.slider} style={customStyles}>
            <div className='' style={customStyles}>
                <div className={'whitespace-nowrap block ' + styles.animation} style={{
                    'WebkitTransform': `translate3d(${translate}%, 0px, 0px)`,
                    'MsTransform': `translate3d(${translate}%, 0px, 0px)`,
                    transform: `translate3d(${translate}%, 0px, 0px)`
                }}>
                    {data != undefined && data.map((item, key) => <EventCard data={item} key={key} index={key} loading={loading} />)}
                    {(data == undefined || data.length == 0) && <BlankCard text={emptyText} />}
                </div>
            </div>
        </div>
    </div>
}