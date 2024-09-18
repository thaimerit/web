import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Booking from '../components/booking/booking'
import BookingCheckout from '../components/booking/bookingCheckout'
import Breadcrumbs from '../components/breadcrumbs'
import Containner from '../components/containner'
import Fortune from '../components/fortune/fortune'
import LineEnd from '../components/line-end'
import MySwiper from '../components/my-swiper/my-swiper'
import PageTitle from '../components/page-title'
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { Box, Tab, TextareaAutosize, TextField } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Button from '../components/button/button'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Omise from '../components/omise'
import { getSession } from 'next-auth/react'
import { checkUserActive } from '../utils/authUtil'
import { API } from '../service/apiService'
import { errorHandler, withReactContent } from '../utils/alertUtil'
import { alertOkButtonColor, danger, primary } from '../utils/variable'
import { t } from 'i18next'
import Error from 'next/error'
import { alpha, styled } from '@mui/material/styles';
import PageItemsPaginate from '../components/carts/page-items-paginate'
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';

function Carts({ session }) {

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
                        label: "ตะกร้าสินค้า",
                        url: "/carts",
                    }
                ]} />
            </div>
            <div className="grid grid-cols-4 gap-4 mt-5">

                <div className='col-span-4'>
                    <div className='detail'>
                        
                        {!loading && <PageItemsPaginate
                            apiUrl={"/users/me/carts"} 
                            className={"mb-5"}
                        />}
                    </div>
                </div>
            </div>
        </Containner>
    )
}

export default Carts

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session)
    if (check) {
        return check
    }

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }

    API.init(session);
    let result = await API.getProfile();
    let user = result.data;

    return {
        props: {
            session,
            user,
        },
    };
}