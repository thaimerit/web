import { Checkbox, createTheme, ThemeProvider } from '@mui/material';
import { orange } from '@mui/material/colors';
import Head from 'next/head';
import { primary } from '../utils/variable';
import Footer from './footer'
import Navbar from './navbar'

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


export default function LayoutLiff({ children }) {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Head>
                    <title>Thai Merit</title>
                </Head>
                <main>{children}</main>
            </ThemeProvider>
        </>
    )
}