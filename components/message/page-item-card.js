import styles from "../../styles/PageItemCard.module.scss";
import { numberFormat } from "../../utils/numberFormat";
import moment from "moment";
import Link from "next/link";
import LineEnd from "../../components/line-end";
import Price from "../price";
import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import { primary } from "../../utils/variable";
import { filterHtmlUtil, stripHtml } from "../../utils/filterHtmlUtil";
import { API } from "../../service/apiService";
import "moment/locale/th";
moment.locale("th");

export default function PageItemCard({ className, data, loading }) {
    if (!loading) loading = false;

    let activeStyle = {};
    // let activeStyle = !data.read ? {color:primary} : {}

    if (loading == true)
        return (
            <div>
                <div className="overflow-hidden rounded-md mb-4">
                    <img
                        className={
                            "rounded-xl " +
                            styles.image +
                            " " +
                            (loading ? " animate-pulse " : "")
                        }
                        style={{ height: "100px" }}
                    />
                </div>
            </div>
        );

    let readMoreButton = (
        <Link href={`/message/${data?.id}`}>
            <a className="active text-primary">อ่านต่อ</a>
        </Link>
    );

    if (data.type  == "product") {
        readMoreButton= (
            <Link href={`/products/${data?.product?.id}`}>
                <a className="active text-primary">ดูรายละเอียด</a>
            </Link>
        );
    }else
    if (data.type  == "package") {
        readMoreButton= (
            <Link href={`/packages/${data?.package?.id}`}>
                <a className="active text-primary">ดูรายละเอียด</a>
            </Link>
        );
    }else
    if (data.type  == "order") {
        readMoreButton= (
            <Link href={`/transactions/${data?.order?.id}`}>
                <a className="active text-primary">ดูรายละเอียด</a>
            </Link>
        );
    }

    return (
        <div className={className}>
            <div className="mb-8">
                <div className="flex flex-col md:flex-row md:justify-between md:align-middle md:items-center">
                    {data.thumbnail && (
                        <img
                            src={API.assetUrl(
                                data.thumbnail.formats.thumbnail.url
                            )}
                            style={{
                                width: "90px",
                                height: "90px",
                                objectFit: "cover",
                                marginRight: "20px",
                            }}
                        />
                    )}
                    <div className="flex-auto">
                        <p className="font-bold" style={activeStyle}>
                            {data.title}
                        </p>
                        <div style={{ fontSize: "12px" }} className="data">
                            {moment(data.createdAt)
                                .add(543, "year")
                                .format("DD MMMM YYYY HH:MM")}{" "}
                            น.
                        </div>
                        <div
                            style={{ fontSize: "14px" }}
                            dangerouslySetInnerHTML={{
                                __html: stripHtml(data.message),
                            }}
                        ></div>
                        {/* {
                        data && data.type == 'order' && data?.order && 
                        <Link href={`/transactions/${data?.order?.id}`}>
                            <a className='active text-primary'>ดูรายละเอียด</a>
                        </Link>
                    }
                    {
                        data && data.type != 'order' && 
                        <Link href={`/message/${data?.id}`}>
                            <a className='active text-primary'>อ่านต่อ</a>
                        </Link>
                    } */}
                        {readMoreButton}
                    </div>
                    {!data.read && (
                        <div>
                            <FiberManualRecordIcon
                                sx={{ color: primary }}
                                color={primary}
                            />
                        </div>
                    )}
                </div>
                <div className="mt-8">
                    <LineEnd />
                </div>
            </div>
        </div>
    );
}
