import { createTheme, ThemeProvider } from '@mui/material';
import Head from 'next/head';
import { primary } from '../utils/variable';
import { FacebookChat } from './facebook-chat';
import { MyChat } from './my-chat';
import Footer from './footer'
import Navbar from './navbar'
import PopupManager from './popup-manager';

const theme = createTheme({
    palette: {
        primary: {
            main: primary,
        },
    },
    typography: {
        fontFamily: [
            'Kanit',
            'sans-serif'
        ].join(','),
    },
});


export default function Layout({ children, appConfig, menus, session }) {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Head>
                    <title>Thai Merit</title>
                </Head>
                <Navbar menus={menus['main-menu']}/>
                <main>{children}</main>
                {/* {appConfig.facebookChatEnable === true && <FacebookChat pageId={appConfig.facebookChatPageId} />} */}
                {appConfig?.facebookChatEnable === true && <MyChat url={appConfig?.facebookChatUrl}/>}
                <PopupManager appConfig={appConfig} session={session}/>
                <Footer footerText={appConfig.footerText} menus={menus}/>
            </ThemeProvider>
        </>
    )
}