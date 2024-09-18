import { getSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Breadcrumbs from '../../components/breadcrumbs'
import Containner from '../../components/containner'
import Fortune from '../../components/fortune/fortune'
import HeadTitle from '../../components/head-title'
import PageItemsPaginate from '../../components/page-items-paginate'
import { API } from '../../service/apiService'
import { checkUserActive } from '../../utils/authUtil'

function Place({ session }) {

    const router = useRouter()

    useEffect(() => {
        API.init(session)
    }, [])

    return (
        <Containner>
            <HeadTitle subTitle="วัดหรือสถานที่" title="สถานที่ศักดิ์สิทธิ์" className="my-10" />

            <PageItemsPaginate apiUrl={"/places"} className={"mb-5"} params={{
                "": true,
                populate: "coverImages.image",
            }}
                mapData={o => {
                    console.log("o--->",o);
                    let coverImages = o.attributes.coverImages[0] !== undefined ? o.attributes.coverImages[0].image.data.attributes.url : null
                    return {
                        id: o.id,
                        thumbnail: coverImages ? API.assetUrl(coverImages) : null,
                        title: o.attributes.fullname,
                        subTitle: o.attributes.templeName, //"วัดหรือสถานที่",
                        url: `/places/${o.id}`,
                    }
                }}
            />

        </Containner>
    )
}

export default Place

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    return {
        props: {
            session
        },
    };
}
