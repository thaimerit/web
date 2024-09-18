import { getSession } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Container } from 'postcss'
import { useEffect, useState } from 'react'
import Breadcrumbs from '../../components/breadcrumbs'
import Containner from '../../components/containner'
import Fortune from '../../components/fortune/fortune'
import HeadTitle from '../../components/head-title'
import LineEnd from '../../components/line-end'
import MySwiper from '../../components/my-swiper/my-swiper'
import PageItemsPaginate from '../../components/page-items-paginate'
import PageTitle from '../../components/page-title'
import { API } from '../../service/apiService'
import { checkUserActive } from '../../utils/authUtil'

function EDonation({ session }) {

    const router = useRouter()

    useEffect(() => {
        API.init(session)
    }, [])

    return (
        <Containner>
            <HeadTitle subTitle="บริจาคเงิน" title="เลือกวัดหรือสถานที่" className="my-10" />

            <PageItemsPaginate apiUrl={"/places"} className={"mb-5"} params={{
                "filters[hasDonation]": true,
                populate: "coverImages.image",
            }}
                mapData={o => {
                    let coverImages = o.attributes.coverImages[0].image.data.attributes.url
                    return {
                        id: o.id,
                        thumbnail: coverImages ? API.assetUrl(coverImages) : null,
                        title: o.attributes.name,
                        subTitle: "บริจาคเงิน",
                        url: `/e-donation/${o.id}`,
                    }
                }}
            // grid={3}
            // contentRender={({ items, loading }) => <div className={"grid sm:grid-cols-1 md:grid-cols-3 gap-4 mt-5"}>
            //     {loading && <div>Loading...</div>}
            //     {!loading && items.map((item, key) => {
            //         return (<div key={key}>{JSON.stringify(item, null, 2)}
            //         </div>)
            //     })}
            // </div>}

            />

        </Containner>
    )
}

export default EDonation

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    return {
        notFound: true
    }

    return {
        props: {
            session
        },
    };
}
