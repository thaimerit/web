import Link from 'next/link'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import Booking from '../../components/booking/booking'
import BookingCheckout from '../../components/booking/bookingCheckout'
import Breadcrumbs from '../../components/breadcrumbs'
import Containner from '../../components/containner'
import Fortune from '../../components/fortune/fortune'
import LineEnd from '../../components/line-end'
import MySwiper from '../../components/my-swiper/my-swiper'
import PageTitle from '../../components/page-title'
import TimelapseIcon from '@mui/icons-material/Timelapse';
import { Box, Tab, TextareaAutosize, TextField } from '@mui/material'
import { TabContext, TabList, TabPanel } from '@mui/lab';
import Button from '../../components/button/button'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import Omise from '../../components/omise'
import { getSession } from 'next-auth/react'
import { checkUserActive } from '../../utils/authUtil'
import DonateCheckout from '../../components/donate/donateCheckout'
import ScaredType from '../../components/scaredtype'
import { API } from '../../service/apiService'
import { errorHandler, withReactContent } from '../../utils/alertUtil'
import { alertOkButtonColor, primary } from '../../utils/variable'
import { t } from 'i18next'
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';

function CheckOut({ session, product }) {

    const MySwal = withReactContent();
    const router = useRouter()
    const [loading, setLoading] = useState(false);
    const [disabled, setDisabled] = useState(true);
    const [value, setValue] = useState('1');
    const [amount, setAmount] = useState(2200);
    const { productId } = router.query
    const [donate, setDonate] = useState(null)
    const [prayer, setPrayer] = useState("")
    const [donationReason, setDonationReason] = useState({})
    const [data, setData] = useState({
        "placeId": productId,
        "prayword": "",
        "price": 0,
        "customer_firstname": session.user.firstName,
        "customer_lastname": session.user.lastName,
        "customer_taxno": "",
        "donationReasons": [],
    })

    useEffect(() => {
        API.init(session)
        initData()
        getReason();
    }, [])

    useEffect(() => {
        let _data = Object.keys(donationReason).filter(o => donationReason[o])
        handleChangeData("donationReasons", {
            target: {
                value: _data
            }
        })
    }, [donationReason])

    useEffect(() => {
        console.log(data)
        if (data.customer_firstname != "" && data.customer_lastname != "" && data.donationReasons.length > 0 && data.price > 0) {
            setDisabled(false)
        } else {
            setDisabled(true)
        }
    }, [data])

    const initData = async () => {
        try {
        } catch (error) {

        }
    }

    const getReason = async () => {
        const reasons = await API.getDonateReason();
        // console.log("reasons---->",reasons)
        setDonate(reasons);
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onClickDonationReason = (reason, key) => {
        let checked = donationReason[reason.id] ? false : true
        setDonationReason(old => ({ ...old, [reason.id]: checked }))
    };

    const onChangePrayer = (e) => {
        setPrayer(e.target.value)
    };

    const handleChangeData = (field, e) => {
        setData(old => {
            return {
                ...old,
                [field]: e.target.value
            }
        })
    };

    const onChangePrice = (price) => {
        setData(old => {
            return {
                ...old,
                price: price
            }
        })
    }

    const onSubmit = () => {

        MySwal.fire({
            icon: "info",
            title: t("Confirm Donation"),
            // showDenyButton: true,
            showCancelButton: true,
            confirmButtonText: t("Confirm"),
            confirmButtonColor: primary,
            cancelButtonText: t("Cancel"),

        }).then(async (result) => {
            if (result.isConfirmed) {
                // console.log(data)
                setLoading(true)
                try {
                    let postData = {
                        customer_firstname: data.customer_firstname,
                        customer_lastname: data.customer_lastname,
                        customer_taxno: data.customer_taxno,
                        type: "donation",
                        donationReason: donationReason
                    }

                    delete data.customer_firstname
                    delete data.customer_lastname
                    delete data.customer_taxno

                    postData.orderItems = [data]

                    let result = await API.createOrder(postData)

                    router.push(`/orders/${result.id}/payment`)
                    
                    // MySwal.fire({
                    //     icon: 'success',
                    //     title: t("Create Donation Success"),
                    //     confirmButtonText: t('OK'),
                    //     confirmButtonColor: alertOkButtonColor,
                    // }).then(() => {

                    // })
                } catch (error) {

                    setLoading(false)

                    let errorMessage = errorHandler(error)

                    MySwal.fire({
                        icon: 'error',
                        title: t("errorTitle"),
                        text: t(errorMessage),
                        confirmButtonText: t('OK'),
                        confirmButtonColor: primary,
                    })

                }

            }
        })

    };

    return (
        <Containner>
            <div className='py-5'>
                {
                    product && <Breadcrumbs items={[
                        {
                            label: "หน้าหลัก",
                            url: "/",
                        },
                        {
                            label: "บริจาค",
                            url: "/e-donation",
                        },
                        {
                            label: product.name,
                            url: "/e-donation/" + productId,
                        },
                        {
                            label: "รายละเอียดการบริจาค",
                            url: "#",
                        },
                    ]} />
                }
            </div>
            <PageTitle>รายละเอียดการบริจาค</PageTitle>
            {
                product && <Breadcrumbs color="text-gray-500 mt-5" items={[
                    {
                        label: product.name,
                        url: "#",
                    },
                    {
                        label: product?.province?.data?.attributes?.name,
                        url: "#",
                    }
                ]} />
            }

            <div className="grid grid-cols-3 gap-4 pt-5">
                <div className='col-span-3 md:col-span-2 md:mr-20'>
                    <LineEnd />
                    <div className='my-5'>
                        <p className='active text-primary text-xl mb-5'>คําอนุโมทนา</p>
                        <TextareaAutosize
                            aria-label="empty textarea"
                            placeholder="เขียนคําอนุโมทนาของคุณ"
                            minRows={15}
                            style={{ width: "100%", border: "1px solid #000", borderRadius: "10px", padding: "10px" }}
                            value={data.prayword}
                            onChange={e => handleChangeData("prayword", e)}
                        />
                    </div>

                    <div className='my-5'>
                        <p className='active text-primary text-xl mb-3'>ข้อมูลสำหรับออกใบอนุโมทนา</p>
                        <div className="grid grid-cols-2 gap-4 mt-5">
                            <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                                <TextField
                                    className="w-full"
                                    label="ชื่อของคุณ"
                                    name="customer_firstname"
                                    value={data.customer_firstname}
                                    variant="outlined"
                                    onChange={e => handleChangeData("customer_firstname", e)}
                                />
                            </div>
                            <div className="mt-6 sm:ml-10 col-span-2 sm:col-span-1">
                                <TextField
                                    className="w-full"
                                    label="ชื่อสกุลของคุณ"
                                    value={data.customer_lastname}
                                    variant="outlined"
                                    name="customer_lastname"
                                    onChange={e => handleChangeData("customer_lastname", e)}
                                />
                            </div>
                            <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                                <TextField
                                    className="w-full"
                                    label="กรอกหมายเลขประจำตัวผู้เสียภาษี"
                                    name="customer_taxno"
                                    value={data.customer_taxno}
                                    variant="outlined"
                                    onChange={e => handleChangeData("customer_taxno", e)}
                                />
                            </div>
                        </div>
                    </div>

                    <LineEnd />

                    <div className='my-5'>
                        <p className='active text-primary text-xl mb-3'>จุดประสงค์การบริจาค</p>
                        <p className='active text-gray-400 text-xs mb-5'>กรุณาเลือกประเภทการบริจาคของคุณ</p>
                        {
                            donate && <div className='flex flex-wrap text-center'>
                                {
                                    donate.map((r, key) =>
                                        <Button type="button" className={'mr-3 mb-3  px-3 py-2 rounded-xl ' + (donationReason[r.id] ? "bg-primary text-white" : "bg-gray-100 text-black")} key={key} onClick={e => onClickDonationReason(r, key)}>
                                            <span >{r.attributes.name}</span>
                                        </Button>
                                    )
                                }
                            </div>
                        }

                    </div>
                </div>

                <div className='col-span-3 md:col-span-1 '>
                    <DonateCheckout onSubmit={onSubmit} price={data.price} disabled={disabled} onChangePrice={onChangePrice} loading={loading} />
                </div>

            </div>


        </Containner>
    )
}

export default CheckOut

export async function getServerSideProps(context) {
    
    return {
        notFound: true
    }

    const session = await getSession(context);

    let check = await checkUserActive(context, session);
    if (check) {
        return check;
    }

    if (!session) {
        return {
            redirect: {
                permanent: false,
                destination: "/login"
            }
        }
    }

    let productId = context.query.productId

    API.init(session)
    let product = await API.getPlaceById(productId)

    // let product = result.attributes

    // if (product.type != "product") {
    //     return {
    //         notFound: true
    //     }
    // }

    // let appConfig = await API.getAppCongfig()

    return {
        props: {
            session,
            product
        },
    };
}