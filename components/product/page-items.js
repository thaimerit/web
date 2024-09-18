import styles from '../../styles/product/PageItems.module.scss'
import PageItemCard from './page-item-card'

export default function PageItems({ className, items, loading }) {
    if (!loading) loading = false

    return <div className={"grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 mt-5 " + className}>
        {loading == true && items.map((item, key) => {
            return (<PageItemCard key={key} loading={true} className={className}/>)
        })}
        {loading == false && items.map((item, key) => {
            return (<PageItemCard key={key} data={item} className={className}/>)
        })}
    </div>
}