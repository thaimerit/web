import styles from '../../styles/your-color-of-the-days/YourColorOfTheDays.module.scss'
import { filterHtmlUtil } from '../../utils/filterHtmlUtil'
import HeadTitle from '../head-title'

function ColorBox({ color, title, check }) {

    return <div className={'flex items-center flex-col mr-4 ' + styles.colorBox}>
        <div className={styles.circle} style={{backgroundColor:color}}>{check != undefined && <i className="fa-solid fa-check"></i>}</div>
        <div className={styles.text} dangerouslySetInnerHTML={{__html:filterHtmlUtil(title)}}></div>
    </div>
}


export default function YourColorOfTheDays({ className, textSubTitle, textTitle, colors }) {
    if(!colors.fortunateColors) return <></>

    return <div className={className}>
        <HeadTitle subTitle="สีของคุณประจำวัน" title="สีนำโชควันนี้" />
        <div className='grid grid-cols-3 md:grid-cols-4 gap-4 mb-4'>
            {colors.fortunateColors.map((color, key)=><ColorBox key={key} color={color.color} title={color.luckName} check/>)}
        </div>
        <HeadTitle title="สีต้องห้ามวันนี้" />
        <div className='grid grid-cols-3 md:grid-cols-4 gap-4'>
            {colors.unfortunateColors.map((color, key)=><ColorBox key={key}  color={color.color} title={`สีต้องห้าม<br>${color.name}`}/>)}
        </div>
    </div>
}