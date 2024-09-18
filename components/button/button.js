import { CircularProgress } from '@mui/material'
import styles from '../../styles/button/Button.module.scss'

export default function Button(props) {
    let disabled = props.disabled
    let colorClass = "bg-primary"

    let color = "primary"
    if(props.color){
        color = props.color
    }
    colorClass = `bg-${color}`

    let px = "px-4"
    if (props.loading === true) {
        disabled = true
    }
    if(props.className){
        let foundPX = props.className.split(" ").find(o=>o.substring(0,2)=="px")
        if(foundPX){
            px = foundPX
        }
    }
    return <button id={props.id} onClick={props.onClick} disabled={disabled} type={props.type ? props.type : "button"} className={`rounded-full text-white  py-4 ${px} ` + (disabled === true ? 'bg-gray-300 ' : colorClass + ' ') + props.className} >
        <div className='flex justify-center '>
        {props.loading == true && <CircularProgress color="inherit" size={20} sx={{marginRight:"10px"}}/>} {props.children}
        </div>
    </button>
}