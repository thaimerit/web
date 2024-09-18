import Link from 'next/link'
import { useRouter } from 'next/router'
import { useState } from 'react'
import DonateCheckout from '../../components/donate/donateCheckout'
import Breadcrumbs from '../../components/breadcrumbs'
import Containner from '../../components/containner'
import Fortune from '../../components/fortune/fortune'
import LineEnd from '../../components/line-end'
import MySwiper from '../../components/my-swiper/my-swiper'
import PageTitle from '../../components/page-title'
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { Box, Tab, TextareaAutosize } from '@mui/material'
import { TabContext, TabList, TabPanel  } from '@mui/lab';
import Button from '../../components/button/button'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Omise from '../../components/omise'
import { getSession } from 'next-auth/react'
import { checkUserActive } from '../../utils/authUtil'
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';

function CheckOut({ session, user }) {

    const router = useRouter()
    const [value, setValue] = useState('1');
    const [amount, setAmount] = useState(2200);
    
    const [data, setData] = useState({
        "email" : session.user.email,
        "name" : session.user.name
    })

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Containner>
            <div className='py-5'>
                <Breadcrumbs items={[
                    {
                        label: "หน้าหลัก",
                        url: "#",
                    },
                    {
                        label: "ทำบุญออนไลน์",
                        url: "#",
                    },
                    {
                        label: " ทำบุญแก้ชง 2565 วัดเล่งเน่ยยี่ กรุงเทพฯ",
                        url: "#",
                    },
                    {
                        label: "รายละเอียดการบริจาค",
                        url: "#",
                    },
                ]} />
            </div>
            <p className='text-xl font-medium'>รายละเอียดการบริจาค</p>
            <Breadcrumbs color="text-gray-500" items={[
                {
                    label: "วัดเล่งเน่ยยี่",
                    url: "#",
                },
                {
                    label: "กรุงเทพฯ",
                    url: "#",
                },
                {
                    label: "ขอพร-แก้บน",
                    url: "#",
                }
            ]} />

            
            <div className="grid grid-cols-3 gap-4 pt-5">
                <div className='col-span-3 sm:col-span-2 sm:mr-20'>
                    <LineEnd />
                    <div className='my-5'>
                        <p className='active text-primary text-xl mb-2'>วิธีการชำระเงิน *</p>
                        <p className='text-xs text-gray-400 mb-5'>กรุณาเลือกวิธีการชำระเงินของคุณ</p>
                        <Box sx={{ width: '100%', typography: 'body1' }}>
                            <TabContext value={value}>
                                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                                    <TabList onChange={handleChange} aria-label="lab API tabs example">
                                        <Tab label="โอนเงินเข้าบัญชี" value="1" />
                                        <Tab label="บัตรเครดิต / เดบิต" value="2" />
                                    </TabList>
                                </Box>
                                <TabPanel value="1" className='py-5 px-0'>
                                    <div className='my-5'>
                                        <p className='mb-4 font-medium'>โอนเงินเข้าบัญชี</p>
                                        <p className='mb-2'>ชื่อบัญชี <span className='text-primary'>บริษัท ลักกี้ เฮง เฮง จำกัด</span></p>
                                        <p className='mb-2'>เลขที่บัญชี <span className='text-primary'>223-4567-789</span></p>
                                        <p className='mb-2'>ธนาคาร <span className='text-primary'>กสิกรไทย</span></p>
                                        <p className='text-xs text-gray-400'>* กรุณาโอนเงินภายใน 1 ชั่วโมง และเก็บสลิปการโอนเงินทุกครั้ง เพื่อนำมายืนยันกับเจ้าหน้าที่</p>
                                    </div>
                                    <LineEnd />
                                    <div className='my-5'>
                                        <p className='active text-primary text-xl mb-2'>ส่งสลิปการโอนเงินเพื่อยืนยัน</p>
                                        <p className='text-xs text-gray-400 mb-2'>กรุณาเลือกรูปใบสลิปการโอนเงินและอัพโหลดเข้าระบบ</p>
                                        <div className='border border-gray-200 rounded w-80 grid grid-cols-6 py-2 my-5'>
                                            <div className='text-center'>
                                                <CheckCircleOutlineOutlinedIcon sx={[{fontSize: 30},{color: '#61CC7F'}]} />
                                            </div>
                                            <div className='col-span-4 grid content-center'>
                                                <p className='text-sm'>ใบสลิปการโอนเงิน</p>
                                            </div>
                                            <div className='text-center'>
                                                <CancelOutlinedIcon sx={[{fontSize: 30}]} />
                                            </div>
                                        </div>

                                        <p className='active text-xs text-primary text-xl mb-2'>อัพโหลดสลิปการโอนเงินแล้ว</p>
                                        <p className='text-xs text-gray-400'>กรุณากดปุ่ม ลูกศรกากบาท เพื่อยกเลิกและต้องการอัพโหลดสลิปโอนเงินใหม่</p>
                                    </div>
                                    <Button type="submit" className="my-10 px-10">
                                        ยืนยันการโอนเงิน
                                    </Button>
                                </TabPanel>
                                <TabPanel value="2">
                                    <p>บัตรเครดิต / เดบิต</p>
                                    <Omise amount={amount} data={data}  />
                                </TabPanel>
                            </TabContext>
                        </Box>
                    </div>
                </div>

                <div className='col-span-3 sm:col-span-1 '>
                    <DonateCheckout customStyles={{ display: "none" }} />
                </div>

                <div className='col-span-3 sm:col-span-2 sm:mr-20'>
                    
                    
                </div>
            </div>
            

        </Containner>
    )
}

export default CheckOut

export async function getServerSideProps(context) {
    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    if (!session) {
        return {
            // redirect: {
            //     permanent: false,
            //     destination: "/login"
            // }
        }
    }
  
    return {
        props: {
            session
        },
    };
}