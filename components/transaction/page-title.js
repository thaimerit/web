import styles from '../styles/PageTitle.module.scss'

export default function PageTitle({ children, className }) {
    return <h1 className={styles.title}>{children}</h1>
}