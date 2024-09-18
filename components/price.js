import styles from '../styles/PageTitle.module.scss'
import { numberFormat } from '../utils/numberFormat'

export default function Price({ price, promotionPrice }) {
    if(!price) return null
    if(promotionPrice && price){
        if(promotionPrice != price){
            return <><span style={{textDecoration: "line-through", color: "#CCC"}}>{numberFormat(price, 2)}</span> <span>{numberFormat(promotionPrice, 2)}</span></>
        }
    }
    return numberFormat(price)
}