import Link from 'next/link'
import styles from '../../styles/slides/SildeHeader.module.scss'
import HeadTitle from '../head-title'
import CircleButton from './buttons/circle-button'

export default function SildeHeader({ title, subTitle, onPrev, onNext, canPrev, canNext, customSlideHeader, customHeader, loading, showAll=false }) {

    if(typeof canPrev == "undefined") canPrev = true
    if(typeof canNext  == "undefined") canNext = true
    // console.log("showAll-->",showAll)
    return <div className={'flex justify-between content-center items-center ' + styles.slideHeader} style={{ ...customSlideHeader, ...customHeader}} >
    <HeadTitle  subTitle={subTitle} title={title} />
    {(loading == false) && <div>
        {showAll && <Link href={showAll}><a style={{marginRight:"10px"}}>ทั้งหมด</a></Link>}
        <CircleButton icon="left" disabled={!canPrev} className="mx-1" onClick={onPrev}/>
        <CircleButton icon="right" disabled={!canNext} className="mx-1" onClick={onNext}/>
    </div>}
</div>
}