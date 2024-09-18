import React, { useEffect, useState } from "react";
import { CircularProgress, TextField } from "@mui/material";
import Button from "../../components/button/button";
import Image from "next/image";
import styles from "../../styles/pages/Profile.module.scss";
import Containner from "../../components/containner";
import LineEnd from "../../components/line-end";
import SocialButton from "../../components/button/social-button";
import Breadcrumbs from "../../components/breadcrumbs";
import Booking from "../../components/booking/booking";
import MySwiper from "../../components/my-swiper/my-swiper";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { API } from "../../service/apiService";
import { alertOkButtonColor, primary } from "../../utils/variable";
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { AdapterMoment } from '@mui/x-date-pickers/AdapterMoment';
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { errorHandler, withReactContent } from "../../utils/alertUtil";
import { checkUserActive, checkUserLiffActive } from "../../utils/authUtil";
import LayoutLiff from "../../components/layout-liff";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';
import * as moment from "moment";
import { LoadingScreen } from "../../components/loading-screen";
import Head from "next/head";

export default function Profile({ session, user }) {

    const { t } = useTranslation();
    const MySwal = withReactContent()
    const router = useRouter()
    const [initing, setIniting] = useState(true);
    const [loading, setLoading] = useState(false)
    // const [user, setUser] = useState(null)
    const [banks, setBanks] = useState([])

    useEffect(() => {
        if (!session) {
            signIn("line")
            return
        }
        initData()
    }, [])

    async function initData(){
        API.init(session);

        try {
            let hasUser = await API.liffProfile();
            if (!hasUser) {
                await signOut({redirect: false})
                router.push("/liff/no-auth");
                return
            }
        } catch (error) {
            console.error("ERROR---->", error.response);
            if(error.response.status == 401){
                await signOut({redirect: false})
                router.push("/liff/no-auth");
                return
            }
        }
        setIniting(false)


        setLoading(true)
        // let result = await API.getProfile();
        // console.log('user : ',result.data);
        // setUser(result.data)

        try {
            let banksPaginate = await API.getBanks({
                'paginate[pageSize]': 100
            });
            setBanks(banksPaginate.data)
        } catch (error) {

        }

        setLoading(false)
    }

    const ProfileSchema = Yup.object().shape({
        firstName: Yup.string().required(t("required")),
        lastName: Yup.string().required(t("required")),
        mobilePhone: Yup.string().optional(),
        email: Yup.string().email(t("invalid_email")).required(t("required")),
        dateOfBirth: Yup.date().optional(),
        bank_no: Yup.string(),
        password: Yup.string(),
        bank_account: Yup.string(),
    });

    if (initing) return <LoadingScreen/>;

    return (
        <LocalizationProvider dateAdapter={AdapterMoment}>
            <div>
                {/* <div className="bg-white drop-shadow-lg h-[4.2rem] border-1 grid content-center">
                    <p className="text-center">บัญชีของฉัน</p>
                </div> */}

                <Formik
                    initialValues={{
                        firstName: user?.firstName || "",
                        lastName: user?.lastName || "",
                        email: user?.email || "",
                        mobilePhone: user?.mobilePhone || "",
                        dateOfBirth: user?.dateOfBirth || "",
                        bank: user?.bankAccount?.bank?.id || "",
                        bank_no: user?.bankAccount?.no || "",
                        bank_account: user?.bankAccount?.account || "",
                    }}
                    validationSchema={ProfileSchema}
                    onSubmit={async (values, { setSubmitting }) => {

                        let data = {}
                        
                        Object.keys(values).forEach(key => {
                            if (values[key] != "") {
                                data[key] = values[key]
                            }
                        })

                        data.bankAccount = {}

                        if (data.bank) {
                            data.bankAccount.bank = data.bank
                        }
                        if (data.bank_no) {
                            data.bankAccount.no = data.bank_no
                        }
                        if (data.bank_account) {
                            data.bankAccount.account = data.bank_account
                        }

                        try {

                            if (data.dateOfBirth) {
                                if (moment.isMoment(data.dateOfBirth)) {
                                    data.dateOfBirth = data.dateOfBirth.format("YYYY-MM-DD")
                                }
                            }

                            let result = await API.patchProfile(data)

                            MySwal.fire({
                                icon: 'success',
                                title: t("updateSuccessTitle"),
                                confirmButtonText: t('OK'),
                                confirmButtonColor: alertOkButtonColor,
                            }).then(() => {
                                router.reload(window.location.pathname)
                            })
                        } catch (error) {

                            let errorMessage = errorHandler(error)

                            MySwal.fire({
                                icon: 'error',
                                title: t("errorTitle"),
                                text: t(errorMessage),
                                confirmButtonText: t('OK'),
                                confirmButtonColor: primary,
                            })
                            setSubmitting(false);
                        }
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
                        setFieldValue
                        /* and other goodies */
                    }) => (
                        <form onSubmit={handleSubmit} >
                            <div className="p-5">
                                <p className="mb-5">ข้อมูลส่วนตัวของฉัน</p>
                                <p className="text-sm mb-5">แก้ไขข้อมูลของฉัน</p>
                                <div className="mb-5">
                                    <TextField
                                        disabled={isSubmitting}
                                        className="w-full"
                                        label="ชื่อของคุณ"
                                        name="firstName"
                                        value={values.firstName}
                                        variant="outlined"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.firstName && touched.firstName}
                                        helperText={errors.firstName && touched.firstName ? (
                                            errors.firstName
                                        ) : null}
                                    />
                                </div>
                                <div className="mb-5">
                                    <TextField
                                        disabled={isSubmitting}
                                        className="w-full"
                                        label="ชื่อสกุลของคุณ"
                                        value={values.lastName}
                                        variant="outlined"
                                        name="lastName"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.lastName && touched.lastName}
                                        helperText={errors.lastName && touched.lastName ? (
                                            errors.lastName
                                        ) : null}
                                    />
                                </div>
                                <div className="mb-5">
                                    <TextField
                                        disabled={isSubmitting}
                                        className="w-full"
                                        label="เบอร์โทรศัพท์"
                                        value={values.mobilePhone}
                                        type="tel"
                                        pattern="[0-9]*"
                                        variant="outlined"
                                        name="mobilePhone"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.mobilePhone && touched.mobilePhone}
                                        helperText={errors.mobilePhone && touched.mobilePhone ? (
                                            errors.mobilePhone
                                        ) : null}
                                    />
                                </div>
                                <div className="mb-5">
                                    <TextField
                                        disabled={isSubmitting}
                                        className="w-full"
                                        label="อีเมล"
                                        value={values.email}
                                        variant="outlined"
                                        name="email"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.email && touched.email}
                                        helperText={errors.email && touched.email ? (
                                            errors.email
                                        ) : null}
                                    />
                                </div>
                                <div className="mb-5">
                                    <MobileDatePicker
                                        disabled={isSubmitting}
                                        label="วันเกิด"
                                        inputFormat="DD/MM/yyyy"
                                        value={values.dateOfBirth}
                                        name="dateOfBirth"
                                        onChange={value => setFieldValue("dateOfBirth", value)}
                                        error={errors.dateOfBirth && touched.dateOfBirth}
                                        helperText={errors.dateOfBirth && touched.dateOfBirth ? (
                                            errors.dateOfBirth
                                        ) : null}
                                        renderInput={(params) => <TextField className="w-full" {...params} />}
                                    />
                                </div>
                                <div className="my-8">
                                    <LineEnd />

                                </div>
                                <div className="mb-5">
                                    <p className="mb-5">บัญชีธนาคารสำหรับรับเงิน</p>
                                    <p className="mb-5">ธนาคารของคุณ</p>
                                </div>
                                <div className="mb-5">

                                    <FormControl fullWidth>
                                        <InputLabel id="bank">ธนาคาร</InputLabel>
                                        <Select
                                            disabled={isSubmitting}
                                            labelId="bank"
                                            id="bank"
                                            value={values.bank}
                                            label="ธนาคาร"

                                            variant="outlined"
                                            name="bank"
                                            onChange={handleChange}
                                            onBlur={handleBlur}
                                            // error={errors.bank && touched.bank}
                                            // helperText={errors.bank && touched.bank ? (
                                            //     errors.bank
                                            // ) : null}
                                        >
                                            <MenuItem value="">กรุณาเลือก</MenuItem>
                                            {banks && banks.map(bank => <MenuItem key={bank.id} value={bank.id}>{bank.attributes.name}</MenuItem>)}
                                        </Select>
                                    </FormControl>


                                </div>
                                <div className="mb-5">

                                    <TextField
                                        disabled={isSubmitting}
                                        className="w-full"
                                        label="เลขที่บัญชี"
                                        value={values.bank_no}
                                        variant="outlined"
                                        name="bank_no"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.bank_no && touched.bank_no}
                                        helperText={errors.bank_no && touched.bank_no ? (
                                            errors.bank_no
                                        ) : null}
                                    />

                                </div>
                                <div className="mb-5">

                                    <TextField
                                        disabled={isSubmitting}
                                        className="w-full"
                                        label="ชื่อบัญชี"
                                        value={values.bank_account}
                                        variant="outlined"
                                        name="bank_account"
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        error={errors.bank_account && touched.bank_account}
                                        helperText={errors.bank_account && touched.bank_account ? (
                                            errors.account
                                        ) : null}
                                    />

                                </div>
                                <div className="grid justify-center">
                                    <Button loading={isSubmitting} type="submit" className="w-40 my-10 px-10" /*disabled={isSubmitting}*/>
                                        บันทึก
                                    </Button>
                                </div>
                            </div>
                        </form>
                    )}
                </Formik>


            </div>
        </LocalizationProvider>
    );
}


export async function getServerSideProps(context) {
    const session = await getSession(context);
    API.init(session);
    let result = await API.getProfile();
    let user = result.data;
    return {
        props: {
            session,
            user
        },
    };
}


Profile.getLayout = function getLayout(page) {
    return (
        <LayoutLiff>
            <Head>
                <title>ข้อมูลส่วนตัวของฉัน</title>
            </Head>
            {page}
        </LayoutLiff>
    )
}