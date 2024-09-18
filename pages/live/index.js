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
import PageTitle from '../../components/page-title'
import { API } from '../../service/apiService'
import { checkUserActive } from '../../utils/authUtil'
import moment from 'moment'
import "moment/locale/th"
import PageItemsPaginate from '../../components/page-items-paginate'
import LivePageItemCard from '../../components/live/page-item-card'

export default function Live({ session }) {

    const router = useRouter()
    const [lives, setLives] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        API.init(session);
        //initData();
    }, []);

    const initData = async () => {
        await getLive();
        setLoading(false);
    };


    const getLive = async () => {
        const rows = await API.getLive();
        setLives(rows);
    }

    return (
        <Containner>
            <HeadTitle subTitle="ไหว้พระออนไลน์" title="เลือกวัดหรือสถานที่" className="my-10" />

            <PageItemsPaginate apiUrl={"/lives/live"} params={{
                "filters[place.coverImages]": true,
                populate: "",
            }}
                // grid={4} // จำนวน grid
                mapData={o => {

                    let data = o.place.coverImages.find((c) => { return c.type == "pc" });
                    //console.log("data--->",data);
                    let coverImages = data !== undefined ? data?.image?.url : ""
                    let startDateMonth = moment(o.startDateTime).locale("th").format("D MMM");
                    let startYear = parseInt(moment(o.startDateTime).format("YYYY")) + 543;
                    let startTime = moment(o.startDateTime).locale("th").format("HH:mm");

                    let endDateMonth = moment(o.endDateTime).locale("th").format("DD MMM");
                    let endYear = parseInt(moment(o.endDateTime).format("YYYY")) + 543;
                    let endTime = moment(o.endDateTime).locale("th").format("HH:mm");
                    return {
                        id: o.id,
                        thumbnail: coverImages ? API.assetUrl(coverImages) : null,
                        title: `${o.name} - ${o.place.name}`,
                        subTitle: `${startDateMonth} ${startYear} - ${endDateMonth} ${endYear}<br>เวลา ${startTime} - ${endTime} น.`,
                        url: `/live/${o.id}`,
                    }
                }}
                itemsRender={({ item, key, loading }) => <LivePageItemCard key={key} data={item} />}
            />
            {
                // lives &&  <div className="grid grid-cols-4 gap-4 mb-10">
                //     {
                //         lives.map((o)=>{
                //             console.log("o--->",o);
                //         })
                //     }
                // </div>
            }


        </Containner>
    )
}

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
