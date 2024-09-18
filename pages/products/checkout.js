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
import { API } from '../../service/apiService'
import { errorHandler, withReactContent } from '../../utils/alertUtil'
import { alertOkButtonColor, danger, primary } from '../../utils/variable'
import { t } from 'i18next'
import Cart from '../../components/cart/cart'
import CartCheckout from '../../components/cart/cartCheckout'
import { Formik } from 'formik'
import * as Yup from "yup";
// import TabContext from '@mui/lab/TabContext';
// import TabList from '@mui/lab/TabList';
// import TabPanel from '@mui/lab/TabPanel';
import { signIn } from "next-auth/react";

function CheckOut({ session, product, appConfig, address }) {

    const router = useRouter()
    const MySwal = withReactContent();
    const { productId, date, period } = router.query
    const [loading, setLoading] = useState(false);
    const [value, setValue] = useState('1');
    const [amount, setAmount] = useState(2200);
    const [data, setData] = useState({
        "productId": productId,
        date,
        period,
        "qty": 1,
        "prayword": ""
    })

    useEffect(() => {
        if(!session){
            signIn()
            return
        }
        API.init(session)
        initData()
    }, [])

    const initData = async () => {
        console.log(product)
    }

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const onChangePrayword = (e) => {
        setData(old => ({ ...old, prayword: e.target.value }))
    };

    const onChangeQty = (qty) => {
        setData(old => ({ ...old, qty }))
    };

    const ProfileSchema = Yup.object().shape({
        address: Yup.string().required(),
        village: Yup.string().required(),
        street: Yup.string().required(),
        province: Yup.string().required(),
        zipCode: Yup.string().required(),
        district: Yup.string().required(),
        subDistrict: Yup.string().required(),
        prayword: Yup.string(),
    });

    const onSubmit = () => {

        MySwal.fire({
            icon: "info",
            title: t("Confirm Rent"),
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
                    let result = await API.createOrder({
                        orderItems: [data],
                        type: "product"
                    })

                    router.push(`/carts`)
                    // router.push(`/orders/${result.id}/payment`)

                    // MySwal.fire({
                    //     icon: 'success',
                    //     title: t("Create Rent Success"),
                    //     confirmButtonText: t('OK'),
                    //     confirmButtonColor: alertOkButtonColor,
                    // }).then(() => {
                    //     router.push(`/orders/${result.id}/payment`)
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
                <Breadcrumbs items={[
                    {
                        label: "หน้าหลัก",
                        url: "/",
                    },
                    {
                        label: "สินค้ามงคล",
                        url: "/products",
                    },
                    {
                        label: product.fullname,
                        url: "/packages/" + product.id,
                    },
                    {
                        label: "รายละเอียดการสั่งจอง",
                        url: "#",
                    },
                ]} />
            </div>
            <p className='text-xl font-medium'>รายละเอียดการสั่งจอง</p>
            {product.place && <Breadcrumbs color="text-gray-500" items={[
                {
                    label: product.place?.templeName,
                    url: "#",
                },
                {
                    label: product.place?.province?.data?.attributes?.name,
                    url: "#",
                },
                {
                    label: product.fullname,
                    url: "#",
                }
            ]} />}

            {!product.place && <Breadcrumbs color="text-gray-500" items={[
                {
                    label: "สินค้ามงคล",
                    url: "#",
                },
                {
                    label: product.fullname,
                    url: "#",
                }
            ]} />}

            <Formik
                initialValues={{
                    address: address?.address || "",
                    village: address?.village || "",
                    street: address?.street || "",
                    alley: address?.alley || "",
                    province: address?.province || "",
                    district: address?.district || "",
                    subDistrict: address?.subDistrict || "",
                    zipCode: address?.zipCode || "",
                    prayword: "",
                }}
                validationSchema={ProfileSchema}
                onSubmit={(values, { setSubmitting }) => {
                

                    MySwal.fire({
                        icon: "info",
                        title: t("Confirm Rent"),
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
                                data.prayword = values.prayword
                                delete values.prayword
                                let result = await API.createOrder({
                                    orderItems: [data],
                                    shippingAddress: values,
                                    type: "product"
                                })
                                
                                router.push(`/carts`)
                                // router.push(`/orders/${result.id}/payment`)
            
                                // MySwal.fire({
                                //     icon: 'success',
                                //     title: t("Create Rent Success"),
                                //     confirmButtonText: t('OK'),
                                //     confirmButtonColor: alertOkButtonColor,
                                // }).then(() => {
                                //     router.push(`/orders/${result.id}/payment`)
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

                    // let data = {};

                    // Object.keys(values).forEach((key) => {
                    //     if (values[key] != "") {
                    //         data[key] = values[key];
                    //     }
                    // });

                    // try {
                    //     let result = await API.patchProfile({ shippingAddress: data });

                    //     MySwal.fire({
                    //         icon: "success",
                    //         title: t("updateSuccessTitle"),
                    //         confirmButtonText: t("OK"),
                    //         confirmButtonColor: alertOkButtonColor,
                    //     }).then(() => {
                    //         router.reload(window.location.pathname);
                    //     });
                    // } catch (error) {
                    //     let errorMessage = errorHandler(error);

                    //     MySwal.fire({
                    //         icon: "error",
                    //         title: t("errorTitle"),
                    //         text: t(errorMessage),
                    //         confirmButtonText: t("OK"),
                    //         confirmButtonColor: primary,
                    //     });
                    //     setSubmitting(false);
                    // }
                }}
            >
                {({
                    values,
                    errors,
                    touched,
                    handleChange,
                    handleBlur,
                    handleSubmit,
                    isSubmitting,
                    setFieldValue,
                    /* and other goodies */
                }) => (


                    <div className="grid grid-cols-3 gap-4 pt-5">
                        <div className='col-span-3 md:col-span-2 md:mr-20'>
                            <LineEnd />
                            <div className='my-5'>



                                <div className="detail">
                                    <h3 className="title">ที่อยู่จัดส่งของ</h3>
                                    <div>กรุณากรอกที่อยู่จัดส่งของคุณ</div>

                                    <div className="mt-6">
                                        <TextField
                                            className="w-full"
                                            label={<>เลขที่ <span style={{ color: "#F00" }}>*</span></>}
                                            name="address"
                                            value={values.address}
                                            variant="outlined"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            error={errors.address && touched.address}
                                            helperText={
                                                errors.address && touched.address ? errors.address : null
                                            }
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-5">
                                        <div className="sm:mr-10 col-span-2 sm:col-span-1">
                                            <TextField
                                                className="w-full"
                                                label={<>อาคาร / หมู่บ้าน <span style={{ color: "#F00" }}>*</span></>}
                                                name="village"
                                                value={values.village}
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.village && touched.village}
                                                helperText={
                                                    errors.village && touched.village ? errors.village : null
                                                }
                                            />
                                        </div>
                                        <div className="sm:ml-10 col-span-2 sm:col-span-1">
                                            <TextField
                                                className="w-full"
                                                label={<>ถนน <span style={{ color: "#F00" }}>*</span></>}
                                                name="street"
                                                value={values.street}
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.street && touched.street}
                                                helperText={
                                                    errors.street && touched.street ? errors.street : null
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-5">
                                        <div className="sm:mr-10 col-span-2 sm:col-span-1">
                                            <TextField
                                                className="w-full"
                                                label={<>จังหวัด <span style={{ color: "#F00" }}>*</span></>}
                                                name="province"
                                                value={values.province}
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.province && touched.province}
                                                helperText={
                                                    errors.province && touched.province ? errors.province : null
                                                }
                                            />
                                        </div>
                                        <div className="sm:ml-10 col-span-2 sm:col-span-1">
                                            <TextField
                                                className="w-full"
                                                label={<>รหัสไปรษณีย์ <span style={{ color: "#F00" }}>*</span></>}
                                                name="zipCode"
                                                value={values.zipCode}
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.zipCode && touched.zipCode}
                                                helperText={
                                                    errors.zipCode && touched.zipCode ? errors.zipCode : null
                                                }
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-2 gap-4 mt-5">
                                        <div className="sm:mr-10 col-span-2 sm:col-span-1">
                                            <TextField
                                                className="w-full"
                                                label={<>แขวง <span style={{ color: "#F00" }}>*</span></>}
                                                name="subDistrict"
                                                value={values.subDistrict}
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.subDistrict && touched.subDistrict}
                                                helperText={
                                                    errors.subDistrict && touched.subDistrict ? errors.subDistrict : null
                                                }
                                            />
                                        </div>
                                        <div className="sm:ml-10 col-span-2 sm:col-span-1">
                                            <TextField
                                                className="w-full"
                                                label={<>เขต <span style={{ color: "#F00" }}>*</span></>}
                                                name="district"
                                                value={values.district}
                                                variant="outlined"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.district && touched.district}
                                                helperText={
                                                    errors.district && touched.district ? errors.district : null
                                                }
                                            />
                                        </div>
                                    </div>

                                    <h3 className="title mb-2">หมายเหตุ</h3>
                                    <TextareaAutosize
                                        name="prayword"
                                        aria-label="empty textarea"
                                        placeholder="เขียนหมายเหตุของคุณ"
                                        minRows={5}
                                        style={{ width: "100%", border: "1px solid #999", borderRadius: "10px", padding: "10px" }}
                                        value={values.prayword}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={loading}
                                    />
                                </div>




                            </div>
                            {/* <LineEnd /> */}
                        </div>

                        <div className='col-span-3 md:col-span-1 '>
                            <CartCheckout
                                product={product}
                                qty={data.qty}
                                onChangeQty={onChangeQty}
                                onSubmit={handleSubmit}
                                vat={appConfig?.vat}
                                loading={loading}
                            />
                        </div>

                    </div>

                )}
            </Formik>


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

    // if (!session) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: "/login"
    //         }
    //     }
    // }

    let productId = context.query.productId

    API.init(session)
    let result = await API.getProductById(productId)
    let product = result.attributes

    if (product.type != "product") {
        return {
            notFound: true
        }
    }

    let appConfig = await API.getAppCongfig()

    let profile = null
    let address = null

    if(session){
        profile = await API.getProfile();
        address = profile.data?.shippingAddress ? profile.data?.shippingAddress : {};
    }
    return {
        props: {
            session,
            product,
            appConfig,
            address
        },
    };
}