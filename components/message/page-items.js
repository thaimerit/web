import styles from '../../styles/transaction/PageItems.module.scss'
import PageItemCard from './page-item-card'

export default function PageItems({ className, items, loading, itemsRender, grid }) {
    if (!loading) loading = false
    if (!grid) grid = 1

    return <div className={`grid sm:grid-cols-1 md:grid-cols-${grid} gap-4 mt-5 ` + className}>
        {loading == true && items.map((item, key) => {
            return (<PageItemCard key={key} loading={true} className={className} />)
        })}
        {loading == false && items.length == 0 && <div className='text-gray-400'>ไม่มีข้อมูล</div>}
        {loading == false && items.map((item, key) => {
            if (itemsRender) return itemsRender({ item, key, loading, grid })
            return (<PageItemCard key={key} data={item} className={className} />)
        })}
    </div>
}