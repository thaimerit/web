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
import MySwiperPackage from "../../components/my-swiper/my-swiper-package";
import PageTitle from "../../components/page-title";
import ScaredType from "../../components/scaredtype";
import MiniSlideNew from "../../components/slides/mini-slide";
import MiniSlide from "../../components/slides/mini-slide";
import MiniSlidePackage from "../../components/slides/mini-slide-package";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import {
    getCoverImagesForDetail,
    getGalleriesForDetail,
} from "../../utils/coverImages";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";

function PlaceDetail({ session, packageData }) {
    const router = useRouter();
    const { slug } = router.query;

    const [slides, setSlide] = useState([]);
    const [product, setProduct] = useState(null);
    const [categories, setCategories] = useState(null);
    const [place, setPlace] = useState(null);
    const [packages, setPackages] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.init(session);
        initData();
    }, []);

    const initData = async () => {
        getData();
        getTopPackages();
    };

    const getData = async () => {
        try {
            // let result = await API.getProductById(slug)
            let product = packageData;
            // console.log(product.galleries);
            // let galleries = product.galleries.map()
            // product.galleries = getGalleriesForDetail(product.galleries, 0)
            setProduct(product);

            let slides = [];

            if (product.coverImages) {
                let items = product.coverImages.map((o) => {
                    return API.assetUrl(o.image.data.attributes.url);
                });

                slides = [...slides, ...items];
            }

            if (product.galleries) {
                let items = product.galleries.map((o) => {
                    return API.assetUrl(o.attributes.url);
                });

                slides = [...slides, ...items];
            }

            setSlide(slides);
        } catch (error) {
            console.log(error);
        }
    };

    const getTopPackages = async () => {
        try {
            let items = await API.getInterestingPackages({});
            setPackages(items);
            setLoading(false);
        } catch (error) {
            console.error(error);
        }
    };

    if (!product) return <></>;

    return (
        <>
            <Containner>
                <div className="py-4">
                    <Breadcrumbs
                        items={[
                            {
                                label: "หน้าหลัก",
                                url: "/",
                            },
                            {
                                label: "ทำบุญออนไลน์",
                                url: "/e-merit",
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
                            label: product.place?.province?.data?.attributes
                                ?.name,
                            url: "#",
                        },
                        {
                            label: product.fullname,
                            url: "#",
                        },
                    ]}
                />

                <div className="grid grid-cols-3 gap-4">
                    <div className="col-span-3 md:col-span-2 lg:col-span-2">
                        <div
                            style={{ marginTop: "20px", marginBottom: "25px" }}
                        >
                            <LineEnd />
                        </div>

                        {product?.sacredTypes?.data && (
                            <ScaredType
                                className={"mb-6"}
                                items={product.sacredTypes.data.map((o) => {
                                    return {
                                        label: o.attributes.name,
                                        url: `/search?sacredType=${o.attributes.name}`,
                                    };
                                })}
                            />
                        )}

                        {
                            <MySwiperPackage
                                items={slides}
                                widthFull={false}
                                imageClass="swiper-in-detail-page"
                            />
                        }
                        {/* <div className='w-full h-full' style={{ backgroundImage: `url(${slides[0]})`, backgroundSize: "cover", backgroundPosition: "center center" }}>
                        <img src={slides[0]}></img>
                        
                    </div> */}

                        <div className="detail">
                            <h3 className="title">รายละเอียดแพ็คเกจ</h3>
                            <div>ของไหว้สำหรับแก้ชง มีดังนี</div>

                            <div
                                dangerouslySetInnerHTML={{
                                    __html: filterHtmlUtil(product.description),
                                }}
                            ></div>

                            {product.service && (
                                <>
                                    <h5 className="title">รายละเอียดบริการ</h5>
                                    <div
                                        dangerouslySetInnerHTML={{
                                            __html: filterHtmlUtil(
                                                product.service
                                            ),
                                        }}
                                    ></div>
                                </>
                            )}
                             <h3 className="title">ตัวอย่าง</h3>
                            <div>
                                <img className="w-64 md:w-96 lg:w-96" src="/images/sample.jpeg" />
                            </div>

                            {product.condition && (
                                <>
                                    <h5 className="title">หมายเหตุ</h5>
                                    <div
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
                    <div className="col-span-3 md:col-span-1 lg:col-span-1 ">
                        <div className="grid justify-items-center">
                            <Booking product={product} />
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
                    title="แพ็กแกจ อื่นๆ ที่น่าสนใจ"
                    loading={loading}
                    data={packages}
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

export default PlaceDetail;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    let slug = context.params.slug;
    API.init(session);
    let packageData = null;
    try {
        let result = await API.getProductById(slug);
        packageData = result.attributes;
        console.log(packageData);
        if (!packageData) {
            return {
                notFound: true,
            };
        }
    } catch (error) {
        console.log(error);
        return {
            notFound: true,
        };
    }

    return {
        props: {
            session,
            packageData,
        },
    };
}
