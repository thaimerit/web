import styles from '../../styles/transaction/PageItems.module.scss'
import PageItemCard from './page-item-card'

export default function PageItems({ className, items, loading, itemsRender, grid }) {
    if (!loading) loading = false
    if (!grid) grid = 3
    
    return <div>
        {loading == true && items.map((item, key) => {
            return (<PageItemCard key={key} loading={true} className={className}/>)
        })}
        {loading == false && items.map((item, key) => {
            if (itemsRender) return itemsRender({ item, key, loading, grid })
            return (<PageItemCard key={key} data={item} className={className} />)
        })}
        {(loading == false && items.length == 0 ) && <div className='text-center text-gray-400 py-8'>
        ไม่มีรายการรอยืนยัน
            </div>}
    </div>
}