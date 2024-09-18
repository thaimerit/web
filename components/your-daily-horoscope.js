import styles from '../styles/YourDailyHoroscope.module.scss'
import { filterHtmlUtil } from '../utils/filterHtmlUtil'
import HeadTitle from './head-title'

export default function YourDailyHoroscope({ className, textSubTitle, textTitle, text }) {
    if(!text) return <></>
    return <div className={className}>
        <HeadTitle subTitle="ทำนายดวงของคุณประจำวัน" className={"mb-3"}/>
        <div className={styles.text} dangerouslySetInnerHTML={{__html:filterHtmlUtil(text)}}></div>
    </div>
}