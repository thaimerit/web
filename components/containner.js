import styles from '../styles/Containner.module.scss'

export default function Containner({children, className}) {
    return <div className={styles.myContainner + " " + className}>{children}</div>
}