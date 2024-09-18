import { useWindowSize } from "../../utils/useWindowSize.hook";
import styles from "../../styles/EventSection.module.scss";
import Link from "next/link";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";

export function EventSectionItem({ option, data }) {
    const size = useWindowSize();
    const width =
        size.width - size.width * ((option.paddingVerticalPercent / 100) * 2);
    const height = width ? width / option.ratio : 0;

    return (
        <Link href={data.url}>
            <a
                style={{
                    backgroundImage: `url(${data.image})`,
                    backgroundPosition: "center center",
                    backgroundSize: "cover",
                    display: "block",
                    backgroundColor: "#CCC",
                    height,
                }}
            >
                <div
                    className={
                        "absolute bottom-0 left-0 right-0 justify-end " +
                        styles.cardBg
                    }
                >
                    <div className="flex">
                        <div className={"mb-3 mr-2 " +styles.leftLine}>
                        </div>
                        <h1 className={"text-white mb-3 " + styles.coverTitle}>{data.coverTitle}</h1>
                    </div>
                    <div
                        className={
                            "text-white rounded-xl flex " + styles.textOveray
                        }
                    >
                        <img
                            className={"rounded-xl " + styles.thumbnail}
                            src={data.thumbnail}
                        />
                        <div className={styles.cardDetail}>
                            <div className={styles.cardSubTitle}>
                                {data.subTitle}
                            </div>
                            <h4
                                className={styles.cardTitle}
                                dangerouslySetInnerHTML={{
                                    __html: filterHtmlUtil(data.title,)
                                }}
                            ></h4>
                        </div>
                    </div>
                </div>
            </a>
        </Link>
    );
}
