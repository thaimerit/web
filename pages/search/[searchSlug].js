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
import Price from '../../components/price'
import { SearchFilter } from '../../components/search-filter'
import { API } from '../../service/apiService'
import { MasterDataService } from '../../service/masterDataService'
import { checkUserActive } from '../../utils/authUtil'
import { getCoverImages, getCoverImagesNoAttributes } from '../../utils/coverImages'
import { numberFormat } from '../../utils/numberFormat'

function Search({ session }) {

    const router = useRouter()
    const { keyword, searchSlug, sacredType } = router.query
    const { placeId } = router.query
    const [place, setPlace] = useState(null)
    const [params, setParams] = useState({
        keyword
    })
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
    }, [placeId])

    useEffect(() => {
        setParams(old=>({...old, keyword, sacredType}))
    }, [keyword])

    function onChangeFilter(filter) {
        setFilter(filter)
        setParams(old=>({...old, ...filter}))
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
                        label: contentTypeText,
                        url: "#",
                    },
                    {
                        label: "ผลการค้นหา",
                        url: "#",
                    },
                ]} />
            </div>

            <div className='flex justify-between items-center'>
                <div>
                    <HeadTitle subTitle={`ผลการค้นหา ${pagination.total} รายการ`} title={resultText} className="my-4" />
                </div>
                {(searchSlug == "packages" || searchSlug == "products") && <div>
                    <SearchFilter filterable={filterable} onChange={onChangeFilter} />
                </div>}
            </div>

            <PageItemsPaginate apiUrl={`/search/${searchSlug}`}
                params={params}
                onParams={({
                    page,
                    pageSize,
                    keyword,
                }) => {
                    return {
                        page,
                        pageSize,
                        keyword,
                        sacredType,
                        ...filter
                    }
                }}
                onResponseData={result => {
                    return {
                        data: result.data.results,
                        pagination: result.data.pagination
                    }
                }}
                onResult={data => {
                    let pagination = data.pagination
                    setPagination(pagination)
                    setResultText(data.text)
                    setContentTypeText(data.name)
                    setFilterable(data.filterable)
                }}
                mapData={o => {
                    let thumbnail = null
                    let url = null
                    let title = null
                    let description = null
                    let subTitle = null

                    if (searchSlug == "holysticks") {
                        title = o.name
                        subTitle = "เสี่ยงเซียมซีออนไลน์"
                        url = `/e-fortune/${o.id}`
                        if (o.place.coverImages.length > 0) {
                            thumbnail = getCoverImagesNoAttributes(o.place.coverImages, "pc")
                        }
                    } else if (searchSlug == "packages") {
                        title = o.fullname
                        subTitle = MasterDataService.productTypes(o.type)?.name
                        url = `/e-merit/${o.id}`
                        description = <div>ราคา <Price price={o.price} promotionPrice={o.promotionPrice} /> บาท / ชุด</div>
                        if (o.coverImages.length > 0) {
                            thumbnail = getCoverImagesNoAttributes(o.coverImages, "pc")
                        }
                    } else if (searchSlug == "products") {
                        title = o.fullname
                        subTitle = MasterDataService.productTypes(o.type)?.name
                        url = `/products/${o.id}`
                        description = <div>ราคา <Price price={o.price} promotionPrice={o.promotionPrice} /> บาท / ชุด</div>
                        if (o.coverImages.length > 0) {
                            thumbnail = getCoverImagesNoAttributes(o.coverImages, "pc")
                        }
                    } else if (searchSlug == "places") {
                        title = o.fullname
                        subTitle = o.templeName
                        url = `/places/${o.id}`
                        if (o.coverImages.length > 0) {
                            thumbnail = getCoverImagesNoAttributes(o.coverImages, "pc")
                        }
                    } else {
                        title = o.fullname
                        if (o.coverImages.length > 0) {
                            thumbnail = getCoverImagesNoAttributes(o.coverImages, "pc")
                        }
                    }

                    return {
                        id: o.id,
                        thumbnail,
                        title,
                        subTitle,
                        description,
                        url
                    }
                }} />

        </Containner>

    )
}

export default Search

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
