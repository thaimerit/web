import styles from '../styles/PageItemCard.module.scss'
import { filterHtmlUtil } from '../utils/filterHtmlUtil'

export default function PageItemCard({ className, data, loading }) {
    if(!loading) loading = false
    
    return <div className={className}>
        {loading==true && <a>
            <div className='overflow-hidden rounded-md mb-4'>
                <img className={"rounded-xl " + styles.image + " " + (loading ? " animate-pulse ": "")} />
            </div>
        </a>}
        {loading==false && <a href={data.url}>
            <div className='overflow-hidden rounded-md'>
                <img className={styles.image} src={data.thumbnail} />
            </div>
            <div className='my-5'>
                <h4 className={styles.cardSubTitle} dangerouslySetInnerHTML={{ __html: filterHtmlUtil(data.subTitle) }}></h4>
                <h4 className={styles.cardTitle} dangerouslySetInnerHTML={{ __html: filterHtmlUtil(data.title) }}></h4>
                {typeof data.description == "object" && <h4 className={styles.cardTitle2}>{data.description}</h4>}
                {typeof data.description != "object" && <h4 className={styles.cardTitle2} dangerouslySetInnerHTML={{ __html: filterHtmlUtil(data.description) }}></h4>}
            </div>
        </a>}
    </div>
}