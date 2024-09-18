import styles from '../../../styles/slides/buttons/CircleButton.module.scss'

export default function CircleButton({ icon, className, disabled, onClick }) {

    let iconEl = <i className="fa-solid fa-chevron-left"></i>

    if(!disabled) disabled = false

    let textClass = ""

    if(disabled){
        textClass = " text-gray-200"
    }

    switch (icon) {
        case "left":
            iconEl = <i className={"fa-solid fa-chevron-left " + textClass}></i>
            break;
        case "right":
            iconEl = <i className={"fa-solid fa-chevron-right " + textClass}></i>
            break;
    }

    return <button type='button' onClick={onClick} disabled={disabled} className={'rounded-full border border-gray-200  '+ className + " " + styles.size}>
       {iconEl}
    </button>
}