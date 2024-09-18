import React, { createRef, useEffect, useState } from "react";
import Button from "../../components/button/button";
import Containner from "../../components/containner";
import Breadcrumbs from "../../components/breadcrumbs";
import { getSession, signOut, useSession } from "next-auth/react";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import ProfileSideBar from "../../components/profile/profile-sidebar";
import moment from "moment";
import 'moment/locale/th'
import PageItemsPaginate from "../../components/message/page-items-paginate";
import { filterHtmlUtil } from "../../utils/filterHtmlUtil";
import MySwiper from "../../components/my-swiper/my-swiper";
import { useRouter } from "next/router";

moment.locale("th")

export default function Message({id}) {
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [slides, setSlides] = useState([])
    const { data: session } = useSession()

    useEffect(() => {
        initData()
    }, [session])

    async function initData(){
        API.init(session)

        let data = null
        let slides = [];

        try {
            let result = await API.getNotification(id);
            data = result.data

            setData(data)

            if (data.galleries) {
                slides = data.galleries.map((o) => {
                    return API.assetUrl(o.url);
                });

                setSlides(slides)
                
            }

        } catch (error) {
            console.log(error)
        }
        
        setLoading(false)
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
                        label: "บัญชีของฉัน",
                        url: "/profile",
                    }
                ]} />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">
                <div className="col-span-4 sm:col-span-1">
                    <ProfileSideBar active="message"/>
                </div>
                <div className='col-span-4 sm:col-span-3 px-0'>
                    {!loading && data && <div className='detail'>
                        <h3 className='title '>{data.title}</h3>
                        <div className='data mb-8'>{moment(data.createdAt).add(543, "year").format("DD MMMM YYYY HH:MM")} น.</div>

                        {slides.length > 0 && <MySwiper  items={slides} />}

                        <div className={"mt-4"} dangerouslySetInnerHTML={{__html: filterHtmlUtil(data.message)}}></div>
                    </div>}
                    {!loading && !data && <div className='detail text-center'>
                        ไม่มีข้อมูล
                    </div>}
                    {loading && <div className='detail text-center'>
                        กำลังโหลด...
                    </div>}
                </div>
            </div>
        </Containner >
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);
    let id = context.params.id

    if(!id){
        return {
            notFound: true
        }
    }

    let check = await checkUserActive(context, session)
    if (check) {
        return check
    }

    return {
        props: {
            id
        },
    };
}
