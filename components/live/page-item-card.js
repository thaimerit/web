import Link from 'next/link'
import styles from '../../styles/live/PageItemCard.module.scss'
import { filterHtmlUtil } from '../../utils/filterHtmlUtil'

export default function PageItemCard({ className, data, loading }) {
    if(!loading) loading = false
    
    return <div className={className}>
        {loading==true && <a>
            <div className='overflow-hidden rounded-md mb-4'>
                <img className={"rounded-xl " + styles.image + " " + (loading ? " animate-pulse ": "")} />
            </div>
            <div className='my-5'>
                <div className={styles.cardSubTitleLoading + " rounded-xl animate-pulse"}></div>
                <div className={styles.cardTitleLoading + " rounded-xl animate-pulse"}></div>
            </div>
        </a>}
        {loading==false && <Link href={data.url}><a href={data.url}>
            <div className='overflow-hidden rounded-md'>
                <img className={styles.image} src={data.thumbnail} />
            </div>
            <div className='my-5'>
                <div className={styles.cardSubTitle} dangerouslySetInnerHTML={{__html:filterHtmlUtil(data.subTitle)}}></div>
                <p className={styles.cardTitle} dangerouslySetInnerHTML={{__html:filterHtmlUtil(data.title)}}></p>
                {data.description && <div className={styles.description}  dangerouslySetInnerHTML={{__html:filterHtmlUtil(data.description)}}></div>}
            </div>
        </a></Link>}
    </div>
}