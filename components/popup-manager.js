import * as moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { API } from "../service/apiService";
import PopupBirthday from "./popup-birthday";
import PopupFortune from "./popup-fortune";
import PopupPromotion from "./popup-promotion";
import PopupTutorial from "./popup-tutorial";

export default function PopupManager({ appConfig, session }) {
    const [openTutorial, setOpenTutorial] = useState(false);
    const [openFortune, setOpenFortune] = useState(false);
    const [openPromotion, setOpenPromotion] = useState(false);
    const [openBirthday, setOpenBirthday] = useState(false);
    const router = useRouter();

    useEffect(() => {
        initLocal();
        initPromotion();
        // initBirthday()
    }, []);

    const initLocal = async () => {
        try {
            if (appConfig?.popupTutorialEnable) {
                let now = moment().format("yyyy-MM-DD").toString();
                let isTrue = localStorage.getItem("guest") === now;
                if (!isTrue) {
                    localStorage.setItem("guest", now);
                    setOpenTutorial(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };

    const initPromotion = async () => {
        try {
            if (appConfig?.popupPromotionEnable) {
                if (appConfig?.popupPromotions?.length > 0) {
                    let now = moment().format("yyyy-MM-DD").toString();
                    let isTrue = localStorage.getItem("promotion") === now;
                    // let isHome = router.pathname == "/"
                    let isLogin = session != undefined

                    if (!isLogin) {
                        localStorage.setItem("promotion", now);
                        setOpenPromotion(true);
                    }
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    const initBirthday = async () => {
        try {
            // let result = await API.getProfile();
            // let user = result.data;
            // let now = moment().format('yyyy-MM-DD').toString();
            // if (user.dateOfBirth === now) {
            //     let isTrue = (localStorage.getItem('birthday') === 'true');
            //     if (!isTrue) {
            //         localStorage.setItem('birthday', 'true')
            //         setOpenBirthday(true)
            //     }
            // }
        } catch (error) {
            console.log(error);
        }
    };

    const handleCloseTutorial = () => {
        setOpenTutorial(false);
    };
    const handleClosePromotion = () => {
        setOpenPromotion(false);
    };
    const handleCloseBirthday = () => {
        setOpenBirthday(false);
    };

    return (
        <>
            {appConfig?.popupTutorialEnable && (
                <PopupTutorial
                    open={openTutorial}
                    handleClose={handleCloseTutorial}
                    items={appConfig?.popupTutorials}
                />
            )}

            {appConfig?.popupHoroscopeEnable && <PopupFortune bgImage={appConfig.popupHoroscopeBackground ? API.assetUrl(appConfig.popupHoroscopeBackground.url) : null} />}

            {appConfig?.popupPromotionEnable && (
                <PopupPromotion
                    open={openPromotion}
                    handleClose={handleClosePromotion}
                    items={appConfig?.popupPromotions}
                    bgImage={appConfig.popupPromotionBackground ? API.assetUrl(appConfig.popupPromotionBackground.url) : null}
                />
            )}

            <PopupBirthday />
        </>
    );
}
