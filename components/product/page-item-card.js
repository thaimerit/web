import Link from 'next/link'
import styles from '../../styles/product/PageItemCard.module.scss'

export default function PageItemCard({ className, data, loading }) {
    if(!loading) loading = false
    
    return <div className={className}>
        {loading==true && <a>
            <div className={'overflow-hidden rounded-md mb-4 '+styles.content}>
                <img className={"rounded-xl " + styles.image + " " + (loading ? " animate-pulse ": "")} />
            </div>
            <div className='my-5'>
                <div className={styles.cardSubTitleLoading + " rounded-xl animate-pulse"}></div>
                <div className={styles.cardTitleLoading + " rounded-xl animate-pulse"}></div>
                <div className={styles.cardTitleLoading + " rounded-xl animate-pulse"}></div>
            </div>
        </a>}
        {loading==false && <Link href={data.url}><a href={data.url}>
            <div className={'overflow-hidden rounded-md '+styles.content}>
                <img className={styles.image} src={data.thumbnail} />
            </div>
            <div className='my-5'>
                <div className='text-sm'>{data.subTitle}</div>
                <p>{data.title}</p>
                {data.description && <>{data.description}</>}
            </div>
        </a></Link>}
    </div>
}