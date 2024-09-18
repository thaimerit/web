import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Booking from "../../components/booking/booking";
import Breadcrumbs from "../../components/breadcrumbs";
import Containner from "../../components/containner";
import Fortune from "../../components/fortune/fortune";
import LineEnd from "../../components/line-end";
import MySwiper from "../../components/my-swiper/my-swiper";
import PageTitle from "../../components/page-title";
import ScaredType from "../../components/scaredtype";
import MiniSlide from "../../components/slides/mini-slide";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import Cart from "../../components/cart/cart";
import {
    getCoverImagesForDetail,
    getGalleriesForDetail,
} from "../../utils/coverImages";
import Button from "../../components/button/button";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";
import MiniSlideNew from "../../components/slides/mini-slide";

function ProductDetail({ session, product,
    slides }) {
    const router = useRouter();
    const { slug } = router.query;
    const [categories, setCategories] = useState(null);
    const [place, setPlace] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.init(session);
        initData();
    }, []);

    const initData = async () => {
        // getData()
        getTopPackages();
    };

    // const getData = async () => {
    //     try {
    //         let result = await API.getProductById(slug)
    //         let product = result.attributes
    //         // console.log(product.galleries);
    //         // let galleries = product.galleries.map()
    //         // product.galleries = getGalleriesForDetail(product.galleries, 0)
    //         setProduct(product)

    //         let slides = []

    //         if (product.coverImages) {
    //             let items = product.coverImages.map(o => {
    //                 return API.assetUrl(o.image.url);
    //             })

    //             slides = [...slides, ...items]
    //         }

    //         if (product.galleries) {
    //             let items = product.galleries.map(o => {
    //                 return API.assetUrl(o.attributes.url);
    //             })

    //             slides = [...slides, ...items]
    //         }

    //         setSlide(slides)

    //     } catch (error) {
    //         console.log(error)
    //     }
    // }

    const getTopPackages = async () => {
        try {
            let items = await API.getInterestingProducts({});
            setPackages(items);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!product) return <></>;

    return ( <>
        <Containner>
            <div className="py-4">
                <Breadcrumbs
                    items={[
                        {
                            label: "หน้าหลัก",
                            url: "/",
                        },
                        {
                            label: "สินค้ามงคล",
                            url: "/products",
                        },
                        {
                            label: product.fullname,
                            url: "#",
                        },
                    ]}
                />
            </div>
            <PageTitle>{product?.fullname}</PageTitle>
            <Breadcrumbs
                color="text-gray-500"
                items={[
                    {
                        label: product.place?.templeName,
                        url: "#",
                    },
                    {
                        label: product.name,
                        url: "#",
                    },
                ]}
            />

            <div className="grid grid-cols-3 gap-4">
                <div className="col-span-3 md:col-span-2 lg:col-span-2">
                    <div style={{ marginTop: "20px", marginBottom: "25px" }}>
                        <LineEnd />
                    </div>

                    {
                        product?.sacredTypes?.data && (
                            <ScaredType
                                className={"mb-6"}
                                items={product.sacredTypes.data.map((o) => {
                                    return {
                                        label: o.attributes.name,
                                        url: `/search?sacredType=${o.attributes.name}`,
                                    };
                                })}
                            />
                        )
                        // product?.sacredTypes?.data.map((o, key) =>
                        // <Button type="button" className={'mr-3 mb-3  px-4 py-1 rounded-xl bg-gray-100 text-gray-800'} key={key} >
                        //     <span >{o.attributes.name}</span>
                        // </Button>
                        // )
                    }

                    <MySwiper
                        items={slides}
                        widthFull={true}
                        imageClass="swiper-in-detail-page"
                    />
                </div>
                <div className="col-span-3 md:col-span-1 lg:col-span-1 ">
                    {/* <Booking product={product} /> */}
                    <div className="grid justify-items-center">
                        <Cart product={product} />
                    </div>
                </div>
                <div className="col-span-3 sm:col-span-2">
                    <div className="detail">
                        <h3 className="title">รายละเอียดสินค้ามงคล</h3>
                        <div
                            className="detail"
                            dangerouslySetInnerHTML={{
                                __html: filterHtmlUtil(product.description),
                            }}
                        ></div>

                        {product.service && (
                            <>
                                <h5 className="title">รายละเอียดบริการ</h5>
                                <div
                                    className="detail"
                                    dangerouslySetInnerHTML={{
                                        __html: filterHtmlUtil(product.service),
                                    }}
                                ></div>
                            </>
                        )}

                        {product.condition && (
                            <>
                                <h5 className="title">หมายเหตุ</h5>
                                <div
                                    className="detail"
                                    dangerouslySetInnerHTML={{
                                        __html: filterHtmlUtil(
                                            product.condition
                                        ),
                                    }}
                                ></div>
                            </>
                        )}

                        {/* <h5 className='title'>หมายเหตุ</h5>
                        <div>ของถวายอาจจะมีการปรับเปลี่ยนรูปแบบโดยที่มูลค่ายังคงเดิม ทางเราขอสงวดสิทธิ์ในการเปลี่ยนแปลงโดยไม่ต้องแจ้งให้ทราบล่วงหน้า</div> */}
                    </div>
                </div>
            </div>

            <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                <LineEnd />
            </div>

            </Containner>

            <div>
                <MiniSlideNew
                    className="mt-10"
                    title="สินค้ามงคล อื่นๆ ที่น่าสนใจ"
                    loading={loading}
                    data={packages}
                    option={{
                        ratio: 1
                    }}
                />
            </div>

            <Containner>

            {/* <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                <LineEnd />
            </div> */}

            {/* {product.place && <div>
                <div className='grid grid-cols-4 rounded-lg bg-white' >
                    <div className='col-span-1'>
                        <img src={getCoverImagesForDetail(product.place.coverImages, "pc")} className="rounded-lg" />
                    </div>
                    <div className='col-span-3 p-5'>
                        <div className='mb-5' dangerouslySetInnerHTML={{ __html: product.place.fullname }}></div>
                        <Link href={`/places/${product.place.id}`}>
                            <a className='active text-primary'>ดูรายละเอียด</a>
                        </Link>
                    </div>
                </div>
            </div>} */}
        </Containner>
        </>
    );
}

export default ProductDetail;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    let slug = context.query.slug;

    let product = null;
    let slides = [];

    try {
        let result = await API.getProductById(slug);
        product = result.attributes;

        if (product.coverImages) {
            let items = product.coverImages.map((o) => {
                return API.assetUrl(o.image.url);
            });

            slides = [...slides, ...items];
        }

        if (product.galleries) {
            let items = product.galleries.map((o) => {
                return API.assetUrl(o.attributes.url);
            });

            slides = [...slides, ...items];
        }
    } catch (error) {
        console.error(error);
    }

    if (!product) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            session,
            product,
            slides,
        },
    };
}
