import { Badge } from '@mui/material';
import { styled } from '@mui/material/styles';
import { signOut, sign, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Fragment, useEffect, useState } from 'react'
import { API } from '../../service/apiService'
import LineEnd from '../line-end'

export default function ProfileSideBar({ active, children, className, color, items, read }) {

    const { data: session } = useSession()

    let activeClass = " active text-primary "

    const isActive = (name) => {
        return active == name ? activeClass : ""
    }

    const [count, setCount] = useState(0)
    const [profile, setProfile] = useState(null)

    useEffect(() => {
        initData()
        if (session) {
            API.init(session)
            
            getProfile()
        }
    }, [read, session])

    const initData = async () => {
        try {
            let result = await API.getUnread()
            let count = result.data.count
            setCount(count)
            if (read === 0) {
                setCount(0)
            }

        } catch (error) {
            console.log(error);
        }
    }
    const getProfile = async () => {
        try {
            let result = await API.getProfile();

            let data = result.data
            data.fullname = data.firstName + ' ' + data.lastName
            setProfile(data)
            // console.log(profile);
            // console.log(result);
        } catch (error) {
            console.log(error);
        }
    }

    async function mySignOut(){
        await signOut();
        localStorage.clear();
    }

    const ThaiMeritBadge = styled(Badge)(({ theme }) => ({
        '& .MuiBadge-badge': {
            color: "#fff"
        },
    }));

    return <div className='flex flex-col'>
        <div>
            <h3 style={{ fontSize: "1.4rem" }}>บัญชีของฉัน</h3>

        </div>
        {session && <>
            <Link href="/profile">
                <a className={isActive("profile") + "mb-4 mt-4"}>
                    ข้อมูลส่วนตัว
                </a>
            </Link>
            <Link href="/address">
                <a className={isActive("address") + "mb-4"}>ที่อยู่</a>
            </Link>
            <Link href="/shipping-address">
                <a className={isActive("shipping-address") + "mb-4"}>ที่อยู่จัดส่ง</a>
            </Link>
            <Link href="/notification">
                <a className={isActive("notification") + "mb-4"}>รับข่าวสารจากระบบ </a>
            </Link>
            <Link href="/message">
                <a className={isActive("message") + "mb-4"}>
                    <span className='mr-5'>กล่องข้อความ </span>
                    <span className="text-white"><ThaiMeritBadge badgeContent={count} showZero color="primary" /></span>
                </a>
            </Link>
            <Link href="/transactions">
                <a className={isActive("transactions") + "mb-4"}>คำสั่งซื้อ</a>
            </Link>
            <a href="#" onClick={mySignOut}>
                ออกจากระบบ
            </a></>}

        {!session &&
            <Link href="/message">
                <a className={isActive("message") + "mb-4 mt-4"}>
                    <span className='mr-5'>กล่องข้อความ </span>
                    <span className="text-white"><ThaiMeritBadge badgeContent={count} showZero color="primary" /></span>
                </a>
            </Link>
        }
    </div>
}