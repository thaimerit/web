import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import Containner from "../../components/containner";
import Fortune from "../../components/fortune/fortune";
import LineEnd from "../../components/line-end";
import MySwiper from "../../components/my-swiper/my-swiper";
import PageTitle from "../../components/page-title";
import ScaredType from "../../components/scaredtype";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";

function PlaceDetail({ session, product, slides }) {
    const router = useRouter();
    // const { slug } = router.query;
    // const [slides, setSlide] = useState([]);
    // const [product, setProduct] = useState(null);

    useEffect(() => {
        API.init(session);
        // initData();
    }, []);

    // const initData = async () => {
    //     try {
    //         let result = await API.getHolystickById(slug);
    //         let product = result.attributes;
    //         setProduct(product);

    //         if (product.place?.galleries) {
    //             let items = product.place?.galleries.map((o) => {
    //                 return API.assetUrl(o.attributes.url);
    //             });
    //             setSlide(items);
    //         }
    //     } catch (error) {
    //         console.error(error);
    //     }
    // };

    return (
        <Containner>
            <div className="py-4">
                <Breadcrumbs
                    items={[
                        {
                            label: "หน้าหลัก",
                            url: "/",
                        },
                        {
                            label: "เสี่ยงเซียมซีออนไลน์",
                            url: "/e-fortune",
                        },
                        {
                            label: product.name,
                            url: "#",
                        },
                    ]}
                />
            </div>

            <PageTitle>{product.place?.highlightName}</PageTitle>

            <LineEnd
                style={{
                    marginTop: "10px",
                    marginBottom: "20px",
                }}
            />

            {product.place?.sacredTypes?.data && (
                <ScaredType
                    className={"mb-6"}
                    items={product.place?.sacredTypes?.data.map((o) => {
                        return {
                            label: o.attributes.name,
                            url: `/search?sacredType=${o.attributes.name}`,
                        };
                    })}
                />
            )}

            <MySwiper items={slides} />

            <div className="grid justify-items-center">
                <div className="md:w-11/12 lg:w-4/5">
                    <div className="detail">
                        <h3 className="title">รายละเอียด</h3>
                        <div
                            className="detail"
                            dangerouslySetInnerHTML={{
                                __html: filterHtmlUtil(product.place?.history),
                            }}
                        ></div>
                    </div>

                    <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                        <LineEnd />
                    </div>

                    <Fortune data={product} />
                </div>
            </div>
        </Containner>
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

    let product = null;
    let slides = [];

    try {
        let result = await API.getHolystickById(slug);
        product = result.attributes;

        if (product.place?.galleries) {
            slides = product.place?.galleries.map((o) => {
                return API.assetUrl(o.attributes.url);
            });
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
