import { Box, Tab } from '@mui/material'
import { TabContext, TabList, TabPanel  } from '@mui/lab';
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Breadcrumbs from '../../components/breadcrumbs'
import Containner from '../../components/containner'
import Fortune from '../../components/fortune/fortune'
import LineEnd from '../../components/line-end'
import MySwiper from '../../components/my-swiper/my-swiper'
import PageTitle from '../../components/page-title'
import Button from '../../components/button/button'
import Omise from '../../components/omise'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import { API } from '../../service/apiService';
import { getSession } from 'next-auth/react';
import { checkUserActive } from '../../utils/authUtil';
import { filterHtmlUtil } from '../../utils/filterHtmlUtil';

function PlaceDetail({ session }) {

    const router = useRouter()
    const { slug } = router.query
    const [value, setValue] = useState('1');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const [slides, setSlide] = useState([])
    const [product, setProduct] = useState(null)
    const [bank, setBank] = useState(null)

    useEffect(() => {
        API.init(session)
        initData()
    }, [])


    const initData = async () => {
        try {
            let result = await API.getPlaceById(slug, {
                params : {
                    'filters[hasDonation]' : true,
                }
            })
            result.attributes.id = result.id
            let product = result.attributes
            // console.log(product);
            setProduct(product)
            if (product.galleries) {
                let items = product.galleries.map(o => {
                    return API.assetUrl(o.attributes.url);
                })
                setSlide(items)
            }
            if (product.bankAccounts) {
                let items = product.bankAccounts.map(o => {
                    return o
                })
                console.log(items);
                setBank(items)
            }
        } catch (error) {

        }
    }

    if (!product) return <></>

    return (
        <Containner>
            <div className='py-4'>
                <Breadcrumbs items={[
                    {
                        label: "หน้าหลัก",
                        url: "/",
                    },
                    {
                        label: "บริจาค",
                        url: "/e-donation",
                    },
                    {
                        label: product.name,
                        url: "#",
                    },
                ]} />
            </div>
            <PageTitle>{product?.name} • {product?.province?.data?.attributes?.name}</PageTitle>
            <div className="mb-5">
                <MySwiper items={slides}/>
            </div>

            <div className='grid justify-items-center'>
                <div className='md:w-11/12 lg:w-4/5'>
                    <div className="grid grid-cols-6 gap-4">
                        <div className='col-span-6 sm:col-span-4'>
                            <div className='detail'>
                                <h3 className='title'>รายละเอียดสถานที่</h3>
                                <div className='leading-10 sm:mr-20' dangerouslySetInnerHTML={{ __html: filterHtmlUtil(product.history) }}></div>
                            </div>
                        </div>
                        <div className='col-span-6 sm:col-span-2'>
                            <div className='sm:py-5'>
                                {product.bankAccounts.map((o, key) =>
                                    <div className='mb-10' key={key}>
                                        <p className='text-primary text-xl font-medium mb-4'>ช่องทางรับบริจาค</p>
                                        <p className='mb-4 font-medium'>โอนเงินเข้าบัญชี</p>
                                        <p className='mb-2'>ชื่อบัญชี <span className='text-primary'>{o.account}</span></p>
                                        <p className='mb-2'>เลขที่บัญชี <span className='text-primary'>{o.no}</span></p>
                                        <p className='mb-3'>ธนาคาร <span className='text-primary'>{o.bank.data.attributes.name}</span></p>
                                    </div>
                                )}
                                {/* <div className=''>
                                    <Link href={`/e-donation/checkout?productId=${product.id}`} >
                                        <a type='button' className='rounded-full text-white  py-4 px-5 bg-primary py-2 px-5'>บริจาคออนไลน์</a>
                                    </Link>
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Containner>
    )
}

export default PlaceDetail


export async function getServerSideProps(context) {
    const session = await getSession(context)

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    return {
        props: {
            session
        },
    }
}