import styles from '../styles/PageItems.module.scss'
import PageItemCard from './page-item-card'

export default function PageItems({ className, items, loading, itemsRender, grid }) {
    if (!loading) loading = false
    if (!grid) grid = 3

    if ((loading == false && items.length == 0)) return <div className={className}>
        <div className='overflow-hidden rounded-lg mb-4 bg-gray-100 flex justify-center items-center h-60 my-4'>
            ไม่มีข้อมูล
        </div>
    </div>

    return <div className={`grid sm:grid-cols-1 md:grid-cols-${grid} gap-4 ` + className}>
        {loading == true && items.map((item, key) => {
            return (<PageItemCard key={key} loading={true} className={className} />)
        })}
        {loading == false && items.map((item, key) => {
            if (itemsRender) return itemsRender({ item, key, loading, grid })
            return (<PageItemCard key={key} data={item} className={className} />)
        })}

    </div>
}