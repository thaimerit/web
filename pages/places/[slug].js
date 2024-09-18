import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Booking from "../../components/booking/booking";
import Breadcrumbs from "../../components/breadcrumbs";
import Button from "../../components/button/button";
import Containner from "../../components/containner";
import Fortune from "../../components/fortune/fortune";
import LineEnd from "../../components/line-end";
import MySwiper from "../../components/my-swiper/my-swiper";
import PageTitle from "../../components/page-title";
import ScaredType from "../../components/scaredtype";
import MiniSlideNew from "../../components/slides/mini-slide";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";

function PlaceDetail({ session, place, slides }) {
    const router = useRouter();
    const { slug } = router.query;

    const [loading, setLoading] = useState(true);
    // const [slides, setSlide] = useState([]);
    const [packages, setPackages] = useState([]);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        API.init(session);
        initData();
    }, []);

    const initData = async () => {
        // await getPlace();
        await getTopPackages();
        await getHolystick();

        setLoading(false);
    };

    const getHolystick = async () => {
        let result = await API.getHolystickByPlaceId(slug);
        if (!result) return null;

        let product = result.attributes;
        setProduct(product);
    };
    // const getPlace = async () => {
    //     try {
    //         let result = await API.getPlaceById(slug);
    //         let place = result.attributes;
    //         setPlace(place);
    //         if (place.galleries) {
    //             // setSlide(place.galleries.filter((o, k) => k > 0))

    //             let items = place.galleries.map((o) => {
    //                 return API.assetUrl(o.attributes.url);
    //             });
    //             setSlide(items);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    const getTopPackages = async () => {
        try {
            let items = await API.getProductsWithFormat({
                "filters[type]": "package",
                "filters[place][id]": slug,
            });
            setPackages(items);
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <Containner>
                <div className="py-4">
                    <Breadcrumbs
                        items={[
                            {
                                label: "หน้าหลัก",
                                url: "/",
                            },
                            {
                                label: "สถานที่",
                                url: "#",
                            },
                            {
                                label: place.highlightName,
                                url: "#",
                            },
                        ]}
                    />
                </div>
                <PageTitle>{place?.highlightName}</PageTitle>

                <LineEnd style={{ marginTop: "10px", marginBottom: "20px" }} />

                {
                    place?.sacredTypes?.data && (
                        <ScaredType
                            items={place.sacredTypes.data.map((o) => {
                                return {
                                    label: o.attributes.name,
                                    url: `/search?sacredType=${o.attributes.name}`,
                                };
                            })}
                        />
                    )
                    // place?.sacredTypes?.data.map((o, key) => (
                    //     <Link
                    //         key={key}
                    //         href={`/search?sacredType=${o.attributes.name}`}
                    //     >
                    //         <a
                    //             type="button"
                    //             className={
                    //                 "mr-3 mb-3  px-4 py-1 rounded-xl bg-gray-100 text-gray-800"
                    //             }
                    //         >
                    //             <span>{o.attributes.name}</span>
                    //         </a>
                    //     </Link>
                    // ))
                }
                <MySwiper items={slides} />

                <div className="grid justify-items-center">
                    <div className="md:w-11/12 lg:w-4/5">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-3">
                                <div
                                    style={{
                                        marginTop: "40px",
                                        marginBottom: "35px",
                                    }}
                                >
                                    <LineEnd />
                                </div>

                                <div className="detail">
                                    <h3 className="title mb-2">
                                        รายละเอียดสถานที่
                                    </h3>
                                    <div
                                        className="detail mb-10"
                                        dangerouslySetInnerHTML={{
                                            __html: place?.history
                                                ? filterHtmlUtil(place.history)
                                                : "",
                                        }}
                                    ></div>

                                    {place?.holythings && (
                                        <>
                                            <h3 className="title  mb-2">
                                                สิ่งศักดิ์สิทธิ์
                                            </h3>
                                            <div
                                                className="detail mb-5"
                                                dangerouslySetInnerHTML={{
                                                    __html: filterHtmlUtil(
                                                        place.holythings
                                                    ),
                                                }}
                                            ></div>
                                        </>
                                    )}

                                    {place?.tags && (
                                        <ScaredType
                                            className={"mt-5 mb-10"}
                                            items={place.tags
                                                .filter(
                                                    (tag) =>
                                                        tag.attributes.type ==
                                                        "holything"
                                                )
                                                .map((o) => {
                                                    return {
                                                        label: o.attributes
                                                            .name,
                                                        url: `/search?sacredType=${o.attributes.name}`,
                                                    };
                                                })}
                                        />
                                    )}

                                    {place?.prayWord && (
                                        <>
                                            {" "}
                                            <h3 className="title mb-2">
                                                คาถาบูชา
                                            </h3>
                                            <div
                                                className="detail mb-10"
                                                dangerouslySetInnerHTML={{
                                                    __html: filterHtmlUtil(
                                                        place.prayWord
                                                    ),
                                                }}
                                            ></div>
                                        </>
                                    )}
                                </div>

                                {/* <div
                                    style={{
                                        marginTop: "40px",
                                        marginBottom: "40px",
                                    }}
                                >
                                    <LineEnd />
                                </div> */}
                                {/* <div>
                                    <MiniSlide
                                        className="mt-10 p-0"
                                        title="ทำบุญออนไลน์"
                                        loading={loading}
                                        data={packages}
                                        customStyles={{ padding: "0px" }}
                                        // customEventImage={{ height: "11.2vw" }}
                                    />
                                </div> */}
                            </div>
                        </div>
                    </div>
                </div>
            </Containner>

            

            <Containner>
                <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                    <LineEnd />
                </div>
            </Containner>

            <MiniSlideNew loading={loading} className="mt-10" title="ทำบุญออนไลน์" data={packages} />

            <Containner>
                <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                    <LineEnd />
                </div>
                <div className="flex justify-around">
                    {product && (
                        <div className="text-center">
                            <h4 className="mb-10 font-medium">
                                เสี่ยงเซียมซี{place && place.fullname}
                            </h4>
                            <Fortune data={product} />
                        </div>
                    )}

                    {place?.bankAccounts?.length > 0 && (
                        <div className="text-center">
                            {place.bankAccounts
                                .filter((o) => o.account)
                                .map((o, key) => (
                                    <div className="mb-5" key={key}>
                                        <p className="mb-10 font-medium">
                                            ช่องทางทำบุญเพิ่มเติม
                                        </p>
                                        <p className="mb-2">
                                            ชื่อบัญชี{" "}
                                            <span className="text-primary">
                                                {o.account}
                                            </span>
                                        </p>
                                        <p className="mb-2">
                                            เลขที่บัญชี{" "}
                                            <span className="text-primary">
                                                {o.no}
                                            </span>
                                        </p>
                                        <p className="mb-3">
                                            ธนาคาร{" "}
                                            <span className="text-primary">
                                                {o.bank?.data?.attributes?.name}
                                            </span>
                                        </p>
                                        {/* <Button
                                                className="px-8 mt-4"
                                                onClick={() => router.push("/e-donation/" + slug)}
                                            >
                                                บริจาคออนไลน์
                                            </Button> */}
                                    </div>
                                ))}
                        </div>
                    )}
                </div>
            </Containner>
        </div>
    );
}

export default PlaceDetail;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    let slug = context.query.slug;

    let place = null;
    let slides = [];

    try {
        let result = await API.getPlaceById(slug);
        place = result.attributes;
        slides = [];

        if (place.galleries) {
            slides = place.galleries.map((o) => {
                return API.assetUrl(o.attributes.url);
            });
        }
    } catch (error) {}

    if (!place) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            session,
            place,
            slides,
        },
    };
}
