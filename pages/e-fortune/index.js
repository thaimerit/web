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
                subTitle="เสี่ยงเซียมซีออนไลน์"
                title="เลือกวัดหรือสถานที่"
                className="my-10"
            />
            <PageItemsPaginate
                apiUrl={"/holysticks"}
                params={{
                    populate: "place,place.coverImages.image",
                }}
                mapData={(o) => {
                    let thumbnail = getCoverImages(o.attributes.place?.data?.attributes?.coverImages, "pc", "medium")
                    return {
                        id: o.id,
                        thumbnail,
                        title: o.attributes.name,
                        subTitle: "เสี่ยงเซียมซีออนไลน์",
                        url: `/e-fortune/${o.id}`,
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
