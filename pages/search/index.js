import { set } from 'lodash'
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
import MiniSlide from '../../components/slides/mini-slide'
import MiniSlidePackage from '../../components/slides/mini-slide-package'
import { API } from '../../service/apiService'
import { MasterDataService } from '../../service/masterDataService'
import { checkUserActive } from '../../utils/authUtil'
import { getCoverImages, getGalleries } from '../../utils/coverImages'
import { numberFormat } from '../../utils/numberFormat'

function Search({ session }) {

    const router = useRouter()
    let { keyword, searchSlug, sacredType } = router.query
    const { placeId } = router.query
    const [place, setPlace] = useState(null)
    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    if(!keyword) keyword = ""
    if(!sacredType) sacredType = ""

    const [search, setSearch] = useState({
        keyword: "",
        sections: [],
        total: 0
    })

    const [titlePlaces, setTitlePlaces] = useState('')
    const [titlePackages, setTitlePackages] = useState('')
    const [titleHolysticks, setTitleHolysticks] = useState('')
    const [titleProducts, setTitleProducts] = useState('')

    const [places, setPlaces] = useState([])
    const [packages, setPackages] = useState([])
    const [holysticks, setHolysticks] = useState([])
    const [products, setProducts] = useState([])

    const [pagination, setPagination] = useState({
        page: 0,
        pageCount: 0,
        pageSize: 0,
        total: 0
    })
    console.log('placeId ---> ', placeId);
    useEffect(() => {
        API.init(session)
        initData()
    }, [keyword])

    const initData = async () => {
        await searchData()
    }

    const searchData = async () => {
        try {
            setLoading(true)
            console.log("======== Search ========");
            console.log(keyword);
            // params['keyword'] = keyword 
            let result = await API.instance.get('/search/', {
                params: {
                    keyword,
                    sacredType
                }
            })

            console.log(result);
            let data = result.data
            setSearch(data)
            console.log('data---------->', data);

            let placeSection = data.sections.find(o => o.slug == "places")

            if (placeSection) {
                setTitlePlaces(placeSection.text)
                let items = placeSection.results.map(o => {

                    return {
                        id: o.id,
                        image: getGalleries(o.galleries, 0),
                        thumbnail: getCoverImages(o.coverImages, "pc"),
                        title: o.highlightName,
                        subTitle: o.templeName + " " + (o.province ? o.province?.name : ""),
                        // description: o.highlightName,
                        url: `/places/${o.id}`,
                    }
                })

                console.log(items)
                setPlaces(items)
            }

            let packageSection = data.sections.find(o => o.slug == "packages")

            if (packageSection) {
                setTitlePackages(packageSection.text)
                let items = packageSection.results.map(o => {
                    return {
                        id: o.id,
                        image: getGalleries(o.galleries, 0),
                        thumbnail: getCoverImages(o.coverImages, "pc"),
                        title: o.fullname,
                        subTitle: MasterDataService.productTypes(o.type)?.name,
                        description: <div>ราคา <Price price={o.price} promotionPrice={o.promotionPrice} /> บาท / ชุด</div>,
                        url: `/packages/${o.id}`,
                    }
                })

                console.log(items)
                setPackages(items)
            }

            let holystickSection = data.sections.find(o => o.slug == "holysticks")

            if (holystickSection) {
                setTitleHolysticks(holystickSection.text)
                let items = holystickSection.results.map(o => {
                    return {
                        id: o.id,
                        image: getGalleries(o.place.galleries, 0),
                        thumbnail: getCoverImages(o.place.coverImages, "pc"),
                        title: o.name,
                        subTitle: "เสี่ยงเซียมซีออนไลน์",
                        url: `/e-fortune/${o.id}`,
                    }
                })

                console.log(items)
                setHolysticks(items)
            }

            let productSection = data.sections.find(o => o.slug == "products")

            if (productSection) {
                setTitleProducts(productSection.text)
                let items = productSection.results.map(o => {
                    return {
                        id: o.id,
                        image: getGalleries(o.galleries, 0),
                        thumbnail: getCoverImages(o.coverImages, "pc"),
                        title: o.fullname,
                        subTitle: MasterDataService.productTypes(o.type)?.name,
                        description: <div>ราคา <Price price={o.price} promotionPrice={o.promotionPrice} /> บาท / ชุด</div>,
                        url: `/products/${o.id}`,
                    }
                })

                console.log(items)
                setProducts(items)
            }
            console.log("======== Search ========");
            setLoading(false)
        } catch (error) {
            console.log(error);
            setLoading(false)
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
                        label: "ผลการค้นหา",
                        url: "#",
                    },
                ]} />
            </div>

            <HeadTitle subTitle={`ผลการค้นหา ${search.total} รายการ`} title={place?.name} className="my-4" />

            <MiniSlide search={true} showAll={`/search/places?keyword=${keyword}&sacredType=${sacredType}`} loading={loading} className="mt-10" title={titlePlaces} data={places} customStyles={{ padding: "0px" }} />

            <MiniSlidePackage search={true}  showAll={`/search/packages?keyword=${keyword}&sacredType=${sacredType}`} loading={loading} className="mt-10" title={titlePackages} data={packages} customStyles={{ padding: "0px" }} />

            <MiniSlide search={true} showAll={`/search/holysticks?keyword=${keyword}&sacredType=${sacredType}`} loading={loading} className="mt-10" title={titleHolysticks} data={holysticks} customStyles={{ padding: "0px" }} />

            <MiniSlide search={true} showAll={`/search/products?keyword=${keyword}&sacredType=${sacredType}`} loading={loading} className="mt-10" title={titleProducts} data={products} customStyles={{ padding: "0px" }} />

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
