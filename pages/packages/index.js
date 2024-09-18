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
import PageItemsPaginate from '../../components/page-items-paginate-packages'
import PageTitle from '../../components/page-title'
import Price from '../../components/price'
import { SearchFilter } from '../../components/search-filter'
import { API } from '../../service/apiService'
import { MasterDataService } from '../../service/masterDataService'
import { checkUserActive } from '../../utils/authUtil'
import { getCoverImages } from '../../utils/coverImages'
import { numberFormat } from '../../utils/numberFormat'

function Package({ session }) {

    const router = useRouter()
    const { keyword } = router.query
    const [params, setParams] = useState({})
    const [resultText, setResultText] = useState("")
    const [contentTypeText, setContentTypeText] = useState("")
    const [items, setItems] = useState([])
    const [filterable, setFilterable] = useState({})
    const [filter, setFilter] = useState({})
    const [loading, setLoading] = useState(true)
    const [pagination, setPagination] = useState({
        page: 0,
        pageCount: 0,
        pageSize: 0,
        total: 0
    })

    useEffect(() => {
        API.init(session)
        setSection()
    }, [])

    const setSection = () => {
        if (keyword === 'แพ็กแกจทำบุญขอพรยอดนิยม' ) {
            setParams({
                'filters[type]': "package",
                'filters[tags][name]': keyword,
                'filters[tags][type]': "package"
            })
        } else {
            setParams({
                'filters[type]': "package",
                'filters[categories][slug]': keyword,
            })
        }
    }

    return (
        <Containner>
            <div className='py-4'>
                <Breadcrumbs items={[
                    {
                        label: "หน้าหลัก",
                        url: "/",
                    },
                    {
                        label: keyword,
                        url: "#",
                    },
                ]} />
            </div>

            <PageItemsPaginate apiUrl={"/products"}
                params={params}
                mapData={o => {
                    let url = null
                    let title = null
                    let description = null
                    let subTitle = null
                    let thumbnail = getCoverImages(o.attributes.coverImages, "pc")

                    title = o.attributes.name
                    url = `/packages/${o.id}`
                    description = o.attributes.description
                    subTitle = o.attributes.condition

                    return {
                        id: o.id,
                        thumbnail,
                        title,
                        subTitle,
                        description,
                        url
                    }
                }} 
                />

        </Containner>

    )
}

export default Package

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
