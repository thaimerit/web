import React, { createRef, useEffect, useState } from "react";
import Button from "../../components/button/button";
import Containner from "../../components/containner";
import Breadcrumbs from "../../components/breadcrumbs";
import { getSession, signOut, useSession } from "next-auth/react";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import ProfileSideBar from "../../components/profile/profile-sidebar";
import moment from "moment";
import PageItemsPaginate from "../../components/message/page-items-paginate";

export default function Message({ session, user }) {
    const [loading, setLoading] = useState(true)
   
    useEffect(() => {
        API.init(session)
        setLoading(false)
    }, [])

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
                    <div className='detail'>
                        <h3 className='title mb-8'>ข้อความ</h3>
                        {!loading && <PageItemsPaginate 
                            apiUrl={"/notifications"} 
                            className={"mb-5"}
                        />}
                    </div>
                </div>
            </div>
        </Containner >
    );
}

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session)
    if (check) {
        return check
    }

    let user = null

    if (session) {
    
        API.init(session);
        let result = await API.getProfile();
        user = result.data;

    }

    return {
        props: {
            session,
            user,
        },
    };
}
