import React, { useEffect, useState } from 'react';
import { Alert, TextField } from '@mui/material';
import Button from '../components/button/button';
import Image from 'next/image';
import styles from '../styles/pages/Login.module.scss'
import Containner from '../components/containner';
import LineEnd from '../components/line-end';
import SocialButton from '../components/button/social-button';
import { getCsrfToken, getProviders, getSession, signIn, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import Link from 'next/link';

export default function Login({ providers, csrfToken }) {
    const { data: session } = useSession()
    const { error } = useRouter().query;
    const { t } = useTranslation();
    const router = useRouter()

    useEffect(() => {
        if (session) {
            router.push("/")
        }
    }, [session])

    if (session) {
        return <div></div>
    }

    return (
        <Containner>
            <div className={'flex justify-center content-center items-center mt-6 ' + styles.loginBoxWrapper}>
                <div className={'flex-col items-center ' + styles.loginBox}>

                    <img src="/images/logo-big.png" className={styles.logo} alt="logo" />

                    {error && <Alert severity="warning"><div dangerouslySetInnerHTML={{__html:t(error)}}></div></Alert>}

                    <form method='post' action="/api/auth/callback/credentials">
                        <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

                        <div className='mt-6'>
                            <TextField className='w-full' label="อีเมล หรือ ชื่อผู้ใช้งาน" variant="outlined" name="email" />
                        </div>
                        <div className='mt-4'>
                            <TextField type="password" className='w-full' label="รหัสผ่าน" variant="outlined" name="password" />
                        </div>
                        <div className="flex justify-between mt-4 text-xs ">
                            <div className='text-gray-400'><Link href="/forgot-password" >ลืมรหัสผ่าน?</Link></div>
                            <div className='text-primary'><Link href="/signup" >สมัครสมาชิก</Link></div>
                        </div>
                        <Button type="submit" className="w-full mt-4 mb-4">เข้าสู่ระบบ</Button>
                    </form>

                    <div className='my-4' style={{ height: "20px" }}>
                        <LineEnd className="" label="หรือ" />
                    </div>

                    {Object.values(providers).filter(provider => provider.id != "credentials").map((provider) => {
                        if(provider.name == "Facebook")
                        return (
                            <SocialButton key={provider.name} icon="/images/social-icon/facebook-new.png" className="w-full mt-4" onClick={() => signIn(provider.id)}>เข้าสู่ระบบด้วย Facebook</SocialButton>
                        );
                        if(provider.name == "Google")
                        return (
                            <SocialButton key={provider.name} icon="/images/social-icon/google-new.png" className="w-full mt-2"  onClick={() => signIn(provider.id)}>เข้าสู่ระบบด้วย Google</SocialButton>
                        );
                    })}

                </div>
            </div>
        </Containner>
    )
}

export async function getServerSideProps(context) {
    const session = await getSession(context)
    
    if (session) {
        return {
            redirect: {
                permanent: false,
                destination: "/profile"
            }
        }
    }
    
    return {
        props: {
            providers: await getProviders(),
            csrfToken: await getCsrfToken(context),
            session
        },
    }
}

// Login.getInitialProps = async (ctx) => {
//     const { req, res } = ctx
//     const providers = await getProviders()
//     const csrfToken = await getCsrfToken()
//     const session = await getSession({ req })

//     return {
//         session: undefined,
//         providers,
//         csrfToken
//     }
// }