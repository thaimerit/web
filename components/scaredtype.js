import Link from "next/link";
import { Fragment } from "react";
import styles from "../styles/ScaredType.module.scss";

export default function ScaredType({ children, className, color, items }) {
    return (
        <div>
            {items.map((item, index) => {
                return (
                    <Link key={index} href="#">
                        <a
                            type="button"
                            className={
                                "mr-3 mb-3  px-4 py-1 rounded-xl hover:bg-gray-300  bg-gray-100 text-gray-800"
                            }
                        >
                            <span className={styles.text}>{item.label}</span>
                        </a>
                    </Link>
                );
            })}
        </div>
    );

    // return <nav className={styles.box + " " + className}>
    //   <ol className="list-reset rounded flex bg-grey-light text-grey">
    //     {items.map((item, index) => {
    //       let activeClass = ""

    //       if (color) {
    //         activeClass = color
    //       } else {
    //         if (index == items.length - 1) {
    //           activeClass = "active text-primary"
    //         }
    //       }

    //       return (<Fragment key={index}>
    //         <li className={"pr-2 " + activeClass}>
    //           <a href={item.url} className="no-underline text-indigo"><span className="hover:bg-gray-300 bg-gray-100 text-gray-800 text-xs mr px-4 py-1 rounded-xl">{item.label}</span></a>
    //         </li>

    //       </Fragment>)
    //     }
    //     )}
    //   </ol>
    // </nav>
}
