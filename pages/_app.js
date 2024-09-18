import { getSession, SessionProvider } from "next-auth/react"
import '../styles/globals.scss'
import variables from '../styles/variables.module.scss'
import i18n from "i18next";
import { useTranslation, initReactI18next } from "react-i18next";
import Layout from '../components/layout'
import { th } from "../locale/th";
import App from "next/app";
import { API } from "../service/apiService";

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    // the translations
    // (tip move them in a JSON file and import them,
    // or even better, manage them via a UI: https://react.i18next.com/guides/multiple-translation-files#manage-your-translations-with-a-management-gui)
    resources: {
      th
    },
    lng: "th", // if you're using a language detector, do not define the lng option
    fallbackLng: "th",

    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });


function MyApp({ Component, pageProps, session, appConfig, menus, ...appProps }) {
  // if ([`/liff/profile`,`/liff/orders`,`/liff/transaction`,`/liff/summary`].includes(appProps.router.pathname)) {
  //     return <Component {...pageProps} />
  // }

  const getLayout = Component.getLayout || ((page) => <Layout session={session} appConfig={appConfig} menus={menus}>{page}</Layout>)

  return <SessionProvider session={session}>
    {getLayout(<Component {...pageProps} />)}
  </SessionProvider>
}


MyApp.getInitialProps = async (appContext) => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps(appContext);

  const session = await getSession(appContext);
  let appConfig = {}
  try {
    appConfig = await API.getAppCongfig()
  } catch (error) {
    console.error("_app.error",
      error.response.data
    )
  }

  let menus = {}
  try {
      menus = await API.getMenus()
      // console.log(JSON.stringify(menus, null, 2))
  } catch (error) {
      console.log(error);
  }

  return { ...appProps, appConfig, menus, session }
}

export default MyApp