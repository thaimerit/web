import Link from 'next/link'
import { Fragment } from 'react'
import styles from '../styles/Breadcrumbs.module.scss'

export default function Breadcrumbs({ children, className, color, items }) {
  return <nav className={styles.box}>
    <ol className="list-reset rounded flex bg-grey-light text-grey">
      {items.map((item, index) => {
        let activeClass = ""

        if (color) {
          activeClass = color
        } else {
          if (index == items.length - 1) {
            activeClass = "active text-primary"
          }
        }

        return (<Fragment key={index}>
          {index != 0 && <li className={"pr-2 " + activeClass}>•</li>}
          <li className={"pr-2 " + activeClass}>
            <a href={item.url} className="no-underline text-indigo">{item.label}</a>
          </li>
        </Fragment>)
      }
      )}
    </ol>
  </nav>
}