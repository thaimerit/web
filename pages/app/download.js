import React, { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Container } from "postcss";
import Breadcrumbs from "../../components/breadcrumbs";
import Containner from "../../components/containner";
import Fortune from "../../components/fortune/fortune";
import HeadTitle from "../../components/head-title";
import LineEnd from "../../components/line-end";
import MySwiper from "../../components/my-swiper/my-swiper";
import PageTitle from "../../components/page-title";
import { API } from "../../service/apiService";
import { checkUserActive } from "../../utils/authUtil";
import moment from "moment";
import "moment/locale/th";
import { Title } from "@mui/icons-material";

export default function Download({ session }) {
  const [loading, setLoading] = useState(true);
  const [os, setOs] = useState(true);

  useEffect(() => {
    API.init(session);
    const os = getMobileOperatingSystem();
    console.log("os-->", os);

    if(os.toLowerCase()=="android"){
       window.location.href=process.env.APP_ANDROID_URL;
    }else if(os.toLowerCase()=="ios"){
       window.location.href=process.env.APP_IOS_URL;
    }else{
        window.location.href="https://www.thaimerit.com";
    }
  }, []);

  const getMobileOperatingSystem = () => {
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;

    // Windows Phone must come first because its UA also contains "Android"
    if (/windows phone/i.test(userAgent)) {
      return "Windows Phone";
    }

    if (/android/i.test(userAgent)) {
      return "Android";
    }

    // iOS detection from: http://stackoverflow.com/a/9039885/177710
    if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
      return "iOS";
    }

    return "unknown";
  };

  return (
    <Containner>
      <HeadTitle
        subTitle="ดาวน์โหลด"
        title="ดาวน์โหลดแอพได้แล้ว ทั้ง iOS และ Android"
        className="my-10"
      />
      <div className="text-center">
        <div className="grid grid-cols-1 md:grid-cols-2">
          <div className="grid  gap-2 justify-items-center mt-4">
            <div>
              <div>
                <img src="/images/qr/ios.png" style={{ maxWidth: "300px" }} />
              </div>
              <div>
                <a href={process.env.APP_IOS_URL} target="_blank" rel="noreferrer">
                  <img
                    src="/images/qr/apple-store.png"
                    style={{ maxWidth: "300px" }}
                  />
                </a>
              </div>
            </div>
          </div>
          <div className="grid gap-2 justify-items-center mt-4">
            <div>
              <div>
                <img
                  src="/images/qr/android.png"
                  style={{ maxWidth: "300px" }}
                />
              </div>
              <div>
                <a href={process.env.APP_ANDROID_URL} target="_blank" rel="noreferrer">
                  <img
                    src="/images/qr/play-store.png"
                    style={{ maxWidth: "300px" }}
                  />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Containner>
  );
}
