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
import VideoPlayer from "../../components/live/video-player";
import Player from "../../components/live/player";
import MySwiper from "../../components/my-swiper/my-swiper";
import PageTitle from "../../components/page-title";
import ScaredType from "../../components/scaredtype";
import MiniSlide from "../../components/slides/mini-slide-detail";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import styles from "../../styles/live/LiveDetail.module.scss";
import LiveTable from "../../components/live-table";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";

function LiveDetail({ session, live, place, slides }) {
    const router = useRouter();
    const { slug } = router.query;
    const [loading, setLoading] = useState(true);
    const [play, setplay] = useState(null);
    const [packages, setPackages] = useState([]);
    const [product, setProduct] = useState(null);

    useEffect(() => {
        API.init(session);
        initData();
    }, []);

    const initData = async () => {
        await getLive();
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
    const getLive = async () => {
        setplay({
            fill: true,
            fluid: true,
            autoplay: true,
            controls: true,
            preload: "metadata",
            sources: [
                {
                    src: live?.url ? live?.url : null,
                    type: "application/x-mpegURL",
                },
            ],
        });

        //     try {
        //         console.log("slug---->", slug);
        //         let live = await API.getLiveById(slug);
        //         console.log("live-->", live)
        //         setLive(live);
        //         setplay({
        //             fill: true,
        //             fluid: true,
        //             autoplay: true,
        //             controls: true,
        //             preload: "metadata",
        //             sources: [
        //                 {
        //                     src: live?.url ? live?.url : null,
        //                     type: "application/x-mpegURL"
        //                 }
        //             ]
        //         });

        //         let place = live.place;
        //         setPlace(place);
        //         if (place.galleries) {
        //             let items = place.galleries.map((o) => {
        //                 return API.assetUrl(o.url);
        //             });
        //             setSlide(items);
        //         }
        //     } catch (error) {
        //         console.error(error);
        //     }
    };

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

    if (loading) return <></>;

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
                                label: "ไหว้พระออนไลน์",
                                url: "/live",
                            },
                            {
                                label: `${live?.name} - ${place?.highlightName}`,
                                url: "#",
                            },
                        ]}
                    />
                </div>
                {
                    <PageTitle>{`${live?.name} - ${place?.highlightName}`}</PageTitle>
                }

                <div style={{ marginTop: "15px", marginBottom: "35px" }}>
                    <LineEnd />
                </div>

                {place?.sacredTypes?.data.map((o, key) => (
                    <Button
                        type="button"
                        className={
                            "mr-3 mb-3  px-4 py-1 rounded-xl bg-gray-100 text-gray-800"
                        }
                        key={key}
                    >
                        <span>{o.name}</span>
                    </Button>
                ))}

                <div className="grid justify-items-center">
                    <div className="md:w-11/12 lg:w-4/5">
                        {/* <VideoPlayer {...play} /> */}
                        {live && <VideoPlayer {...play} />}
                    </div>
                </div>

                <div className="grid justify-items-center">
                    <div className="md:w-11/12 lg:w-4/5">
                        <div
                            style={{ marginTop: "40px", marginBottom: "35px" }}
                        >
                            <LineEnd />
                        </div>
                        <div className="detail">
                            <h3 className="title mb-2">ตาราง Live สด</h3>

                            {live && <LiveTable data={live} />}
                        </div>

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

                                <div
                                    style={{
                                        marginTop: "40px",
                                        marginBottom: "40px",
                                    }}
                                >
                                    <LineEnd />
                                </div>
                            </div>
                        </div>
                        <div
                            style={{ marginTop: "40px", marginBottom: "40px" }}
                        >
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
                                    {place.bankAccounts.map((o, key) => (
                                        <div className="mb-5" key={key}>
                                            <p className="mb-10 font-medium">
                                                ช่องทางรับบริจาค
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
                                                    {
                                                        o.bank.data.attributes
                                                            .name
                                                    }
                                                </span>
                                            </p>
                                            <Button
                                                className="px-8 mt-4"
                                                onClick={() =>
                                                    router.push(
                                                        "/e-donation/" + slug
                                                    )
                                                }
                                            >
                                                บริจาคออนไลน์
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </Containner>
        </div>
    );
}

export default LiveDetail;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    let slug = context.query.slug;

    let live = null;
    let place = null;
    let slides = [];

    try {
        live = await API.getLiveById(slug);
        place = live.place;
        if (place.galleries) {
            slides = place.galleries.map((o) => {
                return API.assetUrl(o.url);
            });
        }
    } catch (error) {
        console.error(error);
    }

    if (!live) {
        return {
            notFound: true,
        };
    }

    return {
        props: {
            session,
            live,
            place,
            slides,
        },
    };
}
