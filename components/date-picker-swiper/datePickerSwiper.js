import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import styles from '../../styles/date-picker-swiper/DatePickerSwiper.module.scss'
import { Pagination, Navigation } from "swiper";
import CircleButton from "../slides/buttons/circle-button";
import { useEffect, useState } from "react";
import moment from "moment";
import 'moment/locale/th'
moment.locale("th")

export default function DatePickerSwiper({ initDate, onChange, minDate }) {

    const [date, setDate] = useState(initDate ? initDate : moment())
    const [items, setItems] = useState([])

    useEffect(() => {
        getDateList()
    }, [date])

    function getDateList() {
        let newDate = date.clone()
        let end = newDate.endOf("month").date()
        let start = newDate.clone().startOf("month")
        setItems([])
        let _items = []
        for (let index = 1; index <= end; index++) {
            start.date(index)
            _items.push({
                date: index,
                moment: start.clone(),
            })
        }
        setItems(_items)

        if (minDate) {
            if (+date.format('YYYYMMDD') < +moment(minDate).format('YYYYMMDD')) {
                setDate(moment())
            }
        }

        if (onChange) onChange(date)
    }

    function onPrev() {
        let newDate = date.clone()
        newDate.subtract(1, "month")
        setDate(newDate)
    }

    function onNext() {
        let newDate = date.clone()
        newDate.add(1, "month")
        setDate(newDate)
    }

    function onClickDate(day) {
        let newDate = date.clone()
        newDate.date(day)
        setDate(newDate)
    }

    let minDateClass = ""
    if (minDate) {
        minDateClass = (+item.moment.format('YYYYMMDD') < +moment().format('YYYYMMDD') ? styles.dateCardInActive : "")
    }

    return <div>
        <div className="flex justify-center py-6">
            <div className="flex justify-center items-center">
                <button type="button" className={styles.monthNextBtn} onClick={onPrev}><i className={"fa-solid fa-chevron-left"}></i></button>
                <div className={styles.monthText}>{date.clone().add(543, "year").format("MMMM • YYYY")}</div>
                <button type="button" className={styles.monthNextBtn} onClick={onNext}><i className={"fa-solid fa-chevron-right"}></i></button>
            </div>
        </div>
        <Swiper
            pagination={{
                clickable: true,
            }}
            slidesPerView={"auto"}
            className={"w-full"}>
            {items.map((item, key) => <SwiperSlide
                key={key}
                onClick={e => onClickDate(item.date)}
                className={styles.dateCard + " " + (date.date() == item.date ? styles.dateCardActive : "") + " " + minDateClass}>
                <div>
                    {item.date}
                </div>
            </SwiperSlide>)}
        </Swiper></div>
}