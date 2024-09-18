import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container } from "postcss";
import { useEffect, useState } from "react";
import Breadcrumbs from "../../components/breadcrumbs";
import Containner from "../../components/containner";
import Fortune from "../../components/fortune/fortune";
import HeadTitle from "../../components/head-title";
import LineEnd from "../../components/line-end";
import MySwiper from "../../components/my-swiper/my-swiper";
import PageItemsPaginate from "../../components/product/page-items-paginate";
import PageTitle from "../../components/page-title";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import { numberFormat } from "../../utils/numberFormat";
import { getCoverImages, getGalleries } from "../../utils/coverImages";
import ProductItemCard from "../../components/product/page-item-card";

function ProductList({ session }) {
    const router = useRouter();

    useEffect(() => {
        API.init(session);
    }, []);

    return (
        <Containner>
            <HeadTitle
                subTitle="สินค้ามงคล"
                title="เลือกสินค้ามงคล"
                className="my-10"
            />

            <PageItemsPaginate
                apiUrl={"/products"}
                params={{
                    "filters[type]": "product",
                    populate: "coverImages.image,categories",
                }}
                mapData={(o) => {
                    let thumbnail = getCoverImages(
                        o.attributes.coverImages,
                        "pc"
                    );

                    let price = o?.attributes?.price;
                    if (o?.attributes?.promotionPrice) {
                        price = o?.attributes?.promotionPrice;
                    }

                    return {
                        id: o.id,
                        thumbnail,
                        title: o.attributes.name,
                        // subTitle: o.attributes.sacredTypes.data.map(o=>o.attributes.name).join(", "),
                        subTitle: "สินค้ามงคล",
                        description: `ราคา ${numberFormat(price)} บาท / ชุด`,
                        url: `/products/${o.id}`,
                    };
                }}
                itemsRender={({ item, key, loading }) => <ProductItemCard key={key} data={item} loading={loading} />}
            />
        </Containner>
    );
}

export default ProductList;

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    return {
        props: {
            session,
        },
    };
}
