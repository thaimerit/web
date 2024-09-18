import styles from '../../styles/Supplement.module.scss'
import { filterHtmlUtil } from '../../utils/filterHtmlUtil'
import HeadTitle from '../head-title'

export default function Supplement({ className, textSubTitle, textTitle, text }) {

    return <div className={className}>
        <HeadTitle subTitle="เสริมบุญเฉพาะคุณ" className={"mb-3"} />
        <div className={styles.text} dangerouslySetInnerHTML={{__html:filterHtmlUtil(text)}}></div>
    </div>
}