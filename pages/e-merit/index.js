import { useRouter } from "next/router";
import Containner from "../../components/containner";
import HeadTitle from "../../components/head-title";
import { getSession } from "next-auth/react";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import PageItemsPaginate from "../../components/page-items-paginate";
import { getCoverImages } from "../../utils/coverImages";

function EFortune({ session }) {
    const router = useRouter();

    return (
        <Containner>
            <HeadTitle
                subTitle="ขอพร-แก้บนออนไลน์"
                title="เลือกวัดหรือสถานที่"
                className="my-10"
            />
            <PageItemsPaginate
                apiUrl={"/places-has-packages"}
                params={{
                }}
                mapData={(o) => {
                    let province = o.province?.name || ""
                    return {
                        id: o.id,
                        thumbnail: getCoverImages(o.coverImages, "pc", "medium"),
                        title: `${o.highlightName}`,
                        subTitle: o.templeName + " " + province,
                        url: `/places/${o.id}`,
                    };
                }}
            />
        </Containner>
    );
}

export default EFortune;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    return {
        props: {
            session,
        },
    };
}
