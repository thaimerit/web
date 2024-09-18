import React, { createRef, useEffect, useState } from "react";
import { Box, CircularProgress, FormControl, FormHelperText, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import Button from "../components/button/button";
import Image from "next/image";
import styles from "../styles/pages/Profile.module.scss";
import Containner from "../components/containner";
import LineEnd from "../components/line-end";
import SocialButton from "../components/button/social-button";
import Breadcrumbs from "../components/breadcrumbs";
import Booking from "../components/booking/booking";
import MySwiper from "../components/my-swiper/my-swiper";
import { getSession, signOut, useSession } from "next-auth/react";
import { Formik } from "formik";
import * as Yup from "yup";
import { useTranslation } from "react-i18next";
import { API } from "../service/apiService";
import { alertOkButtonColor, danger, primary } from "../utils/variable";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { useRouter } from "next/router";
import { errorHandler, withReactContent } from "../utils/alertUtil";
import { checkUserActive } from "../utils/authUtil";
import ProfileSideBar from "../components/profile/profile-sidebar";
import moment from "moment";
import { numberFormat } from "../utils/numberFormat";

export default function Profile({ session, user }) {
  const { t } = useTranslation();
  const MySwal = withReactContent();
  const router = useRouter();
  const inputFileRef = createRef(null);
  const [userPicture, setUserPicture] = useState(user.picture);
  const [hasUploadPicture, setHasUploadPicture] = useState(false);

  useEffect(() => {
    API.init(session);
  }, []);

  const ProfileSchema = Yup.object().shape({
    firstName: Yup.string().required(t("required")),
    lastName: Yup.string().required(t("required")),
    username: Yup.string().required(t("required")),
    mobilePhone: Yup.string().optional(),
    email: Yup.string().email(t("invalid_email")).required(t("required")),
    gender: Yup.string(),
    dateOfBirth: Yup.date().optional(),
    dateOfBirthType: Yup.string().optional(),
    oldPassword: Yup.string(),
    password: Yup.string(),
    passwordConfirmation: Yup.string().test(
      "passwords-match",
      t("passwords_must_match"),
      function (value) {
        return this.parent.password === value;
      }
    ),
  });

  if (!session) {
    return (
      <CircularProgress
        color="inherit"
        size={20}
        sx={{ marginRight: "10px" }}
      />
    );
  }

  function onDeleteAccount() {
    MySwal.fire({
      icon: "error",
      title: t("Confirm Delete Account"),
      // showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: t("Delete Account"),
      confirmButtonColor: danger,
      // denyButtonText: t("Cancel"),
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          let result = await API.deleteProfile(user.id);

          MySwal.fire({
            icon: "success",
            title: "ลบข้อมูลเรียบร้อยแล้ว",
            confirmButtonText: t("OK"),
            confirmButtonColor: alertOkButtonColor,
          }).then(async () => {
            await signOut();
            localStorage.clear();
          });
        } catch (error) {
          let errorMessage = errorHandler(error);

          MySwal.fire({
            icon: "error",
            title: t("errorTitle"),
            text: t(errorMessage),
            confirmButtonText: t("OK"),
            confirmButtonColor: primary,
          });
        }
      }
    });
  }

  const onClickUploadFile = (e) => {
    MySwal.fire({
      icon: "info",
      title: t("Confirm Upload Profile image"),
      // showDenyButton: true,
      // showCancelButton: true,
      confirmButtonText: t("Confirm Upload Profile image"),
      confirmButtonColor: primary,
    }).then(async (result) => {
      if (result.isConfirmed) {
        e.preventDefault();
        inputFileRef.current.click();
      }
    });
  };
  const handleOnChangeFile = (e) => {
    const newImage = event.target?.files?.[0];

    if (newImage) {
      setUserPicture(URL.createObjectURL(newImage));
      setHasUploadPicture(newImage);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Containner>
        <div className="py-4">
          <Breadcrumbs
            items={[
              {
                label: "หน้าหลัก",
                url: "#",
              },
              {
                label: "บัญชีของฉัน",
                url: "#",
              },
            ]}
          />
        </div>
        <div className="grid grid-cols-4 gap-0 mt-5">
          <div className="col-span-4 sm:col-span-1">
            <ProfileSideBar active="profile" />
          </div>

          <Formik
            initialValues={{
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              email: user?.email || "",
              mobilePhone: user?.mobilePhone || "",
              gender: user?.gender || "",
              dateOfBirth: user?.dateOfBirth || "",
              dateOfBirthType: user?.dateOfBirthType || "",
              oldPassword: "",
              password: "",
              passwordConfirmation: "",
              username: user?.username,
            }}
            validationSchema={ProfileSchema}
            onSubmit={async (values, { setSubmitting }) => {
              let data = {};

              Object.keys(values).forEach((key) => {
                if (values[key] != "") {
                  data[key] = values[key];
                }
              });

              if (values.oldPassword != "") {
                if (
                  values.password == "" ||
                  values.passwordConfirmation == ""
                ) {
                  MySwal.fire({
                    icon: "error",
                    title: t("incorrectPassword"),
                    confirmButtonText: t("OK"),
                    confirmButtonColor: primary,
                  });
                  return;
                }
              }

              try {
                if (data.dateOfBirth) {
                  if (moment.isMoment(data.dateOfBirth)) {
                    data.dateOfBirth = data.dateOfBirth.format("YYYY-MM-DD");
                  }
                }
                if (hasUploadPicture) {
                  let photo = await API.uploadProfileImage(
                    inputFileRef.current?.files?.[0]
                  );
                  data.photo = photo.id;
                }

                let result = await API.patchProfile(data);

                MySwal.fire({
                  icon: "success",
                  title: t("updateSuccessTitle"),
                  confirmButtonText: t("OK"),
                  confirmButtonColor: alertOkButtonColor,
                }).then(() => {
                  router.reload(window.location.pathname);
                });
              } catch (error) {
                let errorMessage = errorHandler(error);

                MySwal.fire({
                  icon: "error",
                  title: t("errorTitle"),
                  text: t(errorMessage),
                  confirmButtonText: t("OK"),
                  confirmButtonColor: primary,
                });
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
              setFieldValue,
              /* and other goodies */
            }) => (
              <form
                onSubmit={handleSubmit}
                className="col-span-4 sm:col-span-3 sm:px-0 sm:py10"
              >
                {/* <pre>
                                    {JSON.stringify(values, null, 2)}
                                </pre> */}

                <div className="flex justify-center relative">
                  <div className={styles.logoWrapper}>
                    {userPicture != null && (
                      <img src={userPicture} className={styles.logo} />
                    )}
                    {userPicture == null && (
                      <img src="/images/user.png" className={styles.logo} />
                    )}
                    <a
                      href="#"
                      onClick={onClickUploadFile}
                      className={
                        styles.upload +
                        " flex justify-center items-center text-white"
                      }
                    >
                      <span>อัพโหลดรูปภาพ</span>
                    </a>
                  </div>
                </div>

                <input
                  ref={inputFileRef}
                  accept="image/*"
                  hidden
                  id="avatar-image-upload"
                  type="file"
                  onChange={handleOnChangeFile}
                />
                  <div className="grid grid-cols-auto">
                    <div className="flex justify-left py-5">
                    <div className="justify-self-left rounded-full border-8 border-primary w-20 h-20">
                      <div className="grid h-full place-content-center ">
                        <p className="text-2xl">
                          {user.point ? numberFormat(user.point, 0 ,false) : 0}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-left mb-5">
                    <p className="text-2xl">แต้มบุญ</p>
                  </div>
                  <LineEnd />
                  </div>
                <div className="detail">

                  <h3 className="title">ข้อมูลส่วนตัวของฉัน</h3>
                  <div>แก้ไขข้อมูลของฉัน</div>
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                      <TextField
                        className="w-full"
                        label={
                          <>
                            ชื่อของคุณ <span style={{ color: "#F00" }}>*</span>
                          </>
                        }
                        name="firstName"
                        value={values.firstName}
                        variant="outlined"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.firstName && touched.firstName}
                        helperText={
                          errors.firstName && touched.firstName
                            ? errors.firstName
                            : null
                        }
                      />
                    </div>
                    <div className="mt-6 sm:ml-10 col-span-2 sm:col-span-1">
                      <TextField
                        className="w-full"
                        label={
                          <>
                            ชื่อสกุลของคุณ{" "}
                            <span style={{ color: "#F00" }}>*</span>
                          </>
                        }
                        value={values.lastName}
                        variant="outlined"
                        name="lastName"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.lastName && touched.lastName}
                        helperText={
                          errors.lastName && touched.lastName
                            ? errors.lastName
                            : null
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                      <TextField
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
                        helperText={
                          errors.mobilePhone && touched.mobilePhone
                            ? errors.mobilePhone
                            : null
                        }
                      />
                    </div>
                    <div className="mt-6 sm:ml-10 col-span-2 sm:col-span-1">
                      <TextField
                        className="w-full"
                        label={
                          <>
                            อีเมล <span style={{ color: "#F00" }}>*</span>
                          </>
                        }
                        value={values.email}
                        variant="outlined"
                        name="email"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.email && touched.email}
                        helperText={
                          errors.email && touched.email ? errors.email : null
                        }
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                      <TextField
                        className="w-full"
                        label="เพศ"
                        value={values.gender}
                        variant="outlined"
                        name="gender"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.gender && touched.gender}
                        helperText={
                          errors.gender && touched.gender ? errors.gender : null
                        }
                      />
                    </div>
                    <div className="mt-6 sm:ml-10 col-span-2 sm:col-span-1">
                      {/* <TextField
                                                className="w-full"
                                                label="วันเกิด"
                                                value={values.dateOfBirth}
                                                variant="outlined"
                                                name="dateOfBirth"
                                                onChange={handleChange}
                                                onBlur={handleBlur}
                                                error={errors.dateOfBirth && touched.dateOfBirth}
                                                helperText={errors.dateOfBirth && touched.dateOfBirth ? (
                                                    errors.dateOfBirth
                                                ) : null}
                                            /> */}

                      <MobileDatePicker
                        label={
                          <>
                            วันเกิด 
                          </>
                        }
                        inputFormat="DD/MM/yyyy"
                        value={values.dateOfBirth}
                        name="dateOfBirth"
                        onChange={(value) => setFieldValue("dateOfBirth", value)
                        }
                        // onChange={handleChange}
                        onBlur={handleBlur}
                        // error={errors.dateOfBirth && touched.dateOfBirth}
                        // helperText={
                        //   errors.dateOfBirth && touched.dateOfBirth
                        //     ? errors.dateOfBirth
                        //     : null
                        // }
                        renderInput={(params) => (
                          <TextField className="w-full" {...params} />
                        )}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    {
                      moment(values.dateOfBirth).format('dddd') === 'Wednesday' || moment(values.dateOfBirth).format('dddd') === 'พุธ' 
                      &&<div className='mt-6 sm:mr-10 col-span-2 sm:col-span-1'> 
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label">{<>ช่วงเวลา <span style={{ color: "#F00" }}>*</span></>}</InputLabel>
                            <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={values.dateOfBirthType}
                            label={<>ช่วงเวลา <span style={{ color: "#F00" }}>*</span></>}
                            name='dateOfBirthType'

                            onChange={handleChange}
                            onBlur={handleBlur}
                            >
                                <MenuItem value='day'>กลางวัน</MenuItem>
                                <MenuItem value='night'>กลางคืน</MenuItem>
                            </Select>
                            <FormHelperText className='mx-8' error={errors.dateOfBirthType && touched.dateOfBirthType}>
                                {errors.dateOfBirthType && touched.dateOfBirthType ? (
                                    errors.dateOfBirthType
                                ) : null}
                            </FormHelperText>
                        </FormControl>
                      </div>
                    }
                    <div className={"mt-6"+ (moment(values.dateOfBirth).format('dddd') === 'Wednesday' || 
                                            moment(values.dateOfBirth).format('dddd') === 'พุธ' ? " sm:ml-10 ": " sm:mr-10 ")+ 
                                            " col-span-2 sm:col-span-1"}>
                      <TextField
                        className="w-full"
                        label={
                          <>
                            ชื่อผู้ใช้งาน{" "}
                            <span style={{ color: "#F00" }}>*</span>
                          </>
                        }
                        value={values.username}
                        variant="outlined"
                        name="username"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.username && touched.username}
                        helperText={
                          errors.username && touched.username
                            ? errors.username
                            : null
                        }
                      />
                    </div>
                  </div>
                </div>

                <div style={{ marginTop: "40px", marginBottom: "40px" }}>
                  <LineEnd />
                </div>
                <div className="detail">
                  <h3 className="title">รหัสผ่านของฉัน</h3>
                  <div>เปลี่ยนรหัสผ่านของฉัน</div>
                  <div className="mt-6 col-span-2 sm:col-span-1">
                    <TextField
                      className="w-full"
                      label="รหัสผ่านเดิม"
                      type="password"
                      value={values.oldPassword}
                      variant="outlined"
                      name="oldPassword"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      error={errors.oldPassword && touched.oldPassword}
                      helperText={
                        errors.oldPassword && touched.oldPassword
                          ? errors.oldPassword
                          : null
                      }
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-5">
                    <div className="mt-6 sm:mr-10 col-span-2 sm:col-span-1">
                      <TextField
                        className="w-full"
                        label="รหัสผ่านใหม่"
                        type="password"
                        value={values.password}
                        variant="outlined"
                        name="password"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={errors.password && touched.password}
                        helperText={
                          errors.password && touched.password
                            ? errors.password
                            : null
                        }
                      />
                    </div>
                    <div className="mt-6 sm:ml-10 col-span-2 sm:col-span-1">
                      <TextField
                        className="w-full"
                        label="ยืนยันรหัสผ่าน"
                        type="password"
                        value={values.passwordConfirmation}
                        variant="outlined"
                        name="passwordConfirmation"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        error={
                          errors.passwordConfirmation &&
                          touched.passwordConfirmation
                        }
                        helperText={
                          errors.passwordConfirmation &&
                          touched.passwordConfirmation
                            ? errors.passwordConfirmation
                            : null
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-between">
                  <Button
                    type="submit"
                    className="my-10 px-10"
                    disabled={isSubmitting}
                  >
                    บันทึก
                  </Button>
                  <Button
                    type="button"
                    onClick={onDeleteAccount}
                    className="my-10 px-10"
                    color="danger"
                    disabled={isSubmitting}
                  >
                    ลบข้อมูลผู้ใช้งาน
                  </Button>
                </div>
              </form>
            )}
          </Formik>
        </div>
      </Containner>
    </LocalizationProvider>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  let check = await checkUserActive(context, session);
  if (check) {
    return check;
  }

  if (!session) {
    return {
      redirect: {
        permanent: false,
        destination: "/login",
      },
    };
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
