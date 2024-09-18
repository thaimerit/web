import styles from '../styles/HeadTitle.module.scss'

export default function HeadTitle({ className, subTitle, title }) {
    return <div className={className}>
        {subTitle != undefined && <h2 className={styles.textSubTitle}>{subTitle}</h2>}
        {title != undefined && <h3 className={styles.textTitle}>{title}</h3>}
    </div>
}