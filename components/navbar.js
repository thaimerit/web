import styles from "../styles/Navbar.module.scss";
import SearchBox from "./search-box/search-box";
import Image from "next/image";
// import logo from '../public/images/logo.png'
// import registerIcon from '../public/images/register-icon.png'
import Link from "next/link";
import { Transition } from "@headlessui/react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import LineEnd from "./line-end";
import Button from "./button/button";
import { white } from "@mui/material/colors";
import ShoppingCartRoundedIcon from "@mui/icons-material/ShoppingCartRounded";
import PersonIcon from "@mui/icons-material/Person";
import { API } from "../service/apiService";
import { Badge } from "@mui/material";
import { styled } from "@mui/material/styles";
import EmailIcon from "@mui/icons-material/Email";
import { fontSize } from "@mui/system";

const ThaiMeritBadge = styled(Badge)(({ theme }) => ({
    "& .MuiBadge-badge": {
        color: "#fff",
        fontSize: "10px",
    },
}));

export default function Navbar({ menus }, props) {
    const { data: session } = useSession();
    const { classes } = props;

    async function MySignOut() {
        await signOut();
        localStorage.clear();
    }
    const [isOpen, setIsOpen] = useState(false);
    const [count, setCount] = useState(0);
    const [message, setMessage] = useState(0);

    const onExpand = () => {
        setIsOpen(!isOpen);
    };
    useEffect(() => {
        API.init(session)
        initData();
    }, [session]);

    const initData = async () => {
        try {
            await countMessage();
        } catch (error) {
        }

        if (session?.user) {
            try {
                await countCart();
            } catch (error) {
            }
        }
    };

    const countCart = async () => {
        try {
            let result = await API.getCartCount();
            let count = result.data.count;
            setCount(count);
        } catch (error) {
            console.log(error);
        }
    };

    const countMessage = async () => {
        try {
            let result = await API.getUnread();
            let count = result.data.count;
            setMessage(count);
            // if (read === 0) {
            //     setMessage(0)
            // }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div>
            <div
                className={
                    "flex content-center items-center justify-between border-b border-gray-200 " +
                    styles.navbarContainer
                }
            >
                <div className="flex items-center">
                    <Link href="/">
                        <a className={styles.logoLink}>
                            <img
                                src="/images/logo.png"
                                className={styles.logo}
                                alt="logo"
                            />
                        </a>
                    </Link>

                    <div className="ml-10 hidden lg:block">
                        {menus?.items &&
                            menus?.items?.map((item, key) => (
                                <Link key={key} href={item.url}>
                                    <a className={styles.menuButtons} target={item.target}>
                                        {item.title}
                                    </a>
                                </Link>
                            ))}

                        {/* <Link href="/products">
                            <a className='mx-4'>สินค้ามงคล</a>
                        </Link> */}
                        {/* <Link href="/e-donation">
                            <a className='mx-4'>บริจาค</a>
                        </Link> */}
                    </div>
                </div>

                <div className="flex flex-row items-center">
                    <SearchBox />
                    <div className="mr-2">
                        <Link href="/carts">
                            <a
                                className={styles.buttonBox}
                                style={{ borderRadius: "50% 50%" }}
                            >
                                <ShoppingCartRoundedIcon
                                    className={styles.iconBox}
                                    style={{ color: "#F68C29" }}
                                />
                                {count>0 && <div
                                    className="absolute right-0"
                                    style={{ top: "-10px" }}
                                >
                                    <ThaiMeritBadge
                                        badgeContent={count}
                                        sx={{ color: "#fff" }}
                                        showZero
                                        color="primary"
                                    />
                                </div>}
                            </a>
                        </Link>
                    </div>
             
                    <div className="mr-2">
                        <Link href="/message">
                            <a
                                className={styles.buttonBox}
                                style={{ borderRadius: "50% 50%" }}
                            >
                                <EmailIcon
                                    className={styles.iconBox}
                                    style={{ color: "#F68C29" }}
                                />
                                {message>0 && <div
                                    className="absolute right-0"
                                    style={{ top: "-10px" }}
                                >
                                    <ThaiMeritBadge
                                        badgeContent={message}
                                        showZero
                                        color="primary"
                                    />
                                </div>}
                            </a>
                        </Link>
                    </div>

                    <div className="items-center whitespace-nowrap">
                        {session == undefined && (
                            <div className="hidden lg:flex items-center">
                                {session?.user?.name && (
                                    <div
                                        className={styles.buttonBox}
                                        style={{ borderRadius: "50% 50%" }}
                                    >
                                        <PersonIcon
                                            className={styles.iconBox}
                                            style={{ color: "#F68C29" }}
                                        />
                                    </div>
                                )}
                                <div className="mx-5">
                                    <a href="#" onClick={() => signIn()}>
                                        เข้าสู่ระบบ
                                    </a>{" "}
                                    | <Link href="/signup">ลงทะเบียน</Link>
                                </div>
                            </div>
                        )}
                        {session != undefined && (
                            <div className="hidden lg:flex items-center">
                                <Link href="/profile">
                                    <a
                                        className={styles.buttonBox}
                                        style={{ borderRadius: "50% 50%" }}
                                    >
                                        <PersonIcon
                                            className={styles.iconBox}
                                            style={{ color: "#F68C29" }}
                                        />
                                    </a>
                                </Link>
                                <div className="mx-3">
                                    <Link href="/profile">
                                        <a className="mr-2">
                                            {session.user.name}
                                        </a>
                                    </Link>
                                    |
                                    <a
                                        className="ml-2"
                                        href="#"
                                        onClick={() => MySignOut()}
                                    >
                                        ออกจากระบบ
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="  lg:hidden">
                        <button href="#" onClick={onExpand} className={styles.buttonMoreBox}>
                            <i className={styles.iconBox + " fa-solid fa-bars"}></i>
                        </button>
                    </div>
                    <div className="hidden">
                        {/* <Link href="/e-merit" >
                            <a className='mx-4'>ทำบุญออนไลน์</a>
                        </Link>
                        <Link href="/e-fortune">
                            <a className='mx-4'>เสี่ยงเซียมซีออนไลน์</a>
                        </Link> */}
                        {menus?.items &&
                            menus?.items?.map((item, key) => (
                                <Link key={key} href={item.url}>
                                    <a className="mx-4" target={item.target}>
                                        {item.title}
                                    </a>
                                </Link>
                            ))}
                        {/* <Link href="/products">
                            <a className='mx-4'>สินค้ามงคล</a>
                        </Link> */}
                        {/* <Link href="/e-donation">
                            <a className='mx-4'>บริจาค</a>
                        </Link> */}
                        {/* <Link href="/live">
                            <a className='mx-4'>ไหว้พระออนไลน์</a>
                        </Link> */}
                    </div>
                </div>
            </div>

            <Transition
                show={isOpen}
                enter="transition ease-out duration-100 transform"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="transition ease-in duration-75 transform"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
                className="w-screen z-10 absolute h-screen inset-0"
            >
                <div className="flex absolute h-screen w-screen">
                    <div className="lg:hidden w-3/5 bg-white ">
                        <div className="flex flex-col p-8 lg:p-12 mb-5">
                            {session != undefined && (
                                <div className="lg:hidden ">
                                    <Link href="/profile">
                                        <a
                                            className="mb-4"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            {session.user.name}
                                        </a>
                                    </Link>
                                    <div
                                        style={{
                                            marginTop: "20px",
                                            marginBottom: "20px",
                                        }}
                                    >
                                        <LineEnd />
                                    </div>
                                </div>
                            )}

                            {/* <Link href="/e-merit" >
                                <a className='mb-4' onClick={() => setIsOpen(false)}>ทำบุญออนไลน์</a>
                            </Link>
                            <Link href="/e-fortune">
                                <a className='mb-4' onClick={() => setIsOpen(false)}>เสี่ยงเซียมซีออนไลน์</a>
                            </Link> */}
                            {menus?.items &&
                                menus?.items?.map((item, key) => (
                                    <Link key={key} href={item.url}>
                                        <a
                                            className="mb-4"
                                            onClick={() => setIsOpen(false)}
                                            target={item.target}
                                        >
                                            {item.title}
                                        </a>
                                    </Link>
                                ))}
                            {/* <Link href="/products">
                                <a className='mb-4'>สินค้ามงคล</a>
                            </Link> */}
                            {/* <Link href="/e-donation">
                                <a className='mb-4'>บริจาค</a>
                            </Link> */}
                            {/* <Link href="/live">
                                <a className='mb-4' onClick={() => setIsOpen(false)}>ไหว้พระออนไลน์</a>
                            </Link> */}
                            <div
                                style={{
                                    marginTop: "10px",
                                    marginBottom: "20px",
                                }}
                            >
                                <LineEnd />
                            </div>
                            {session != undefined && (
                                <div className="lg:flex items-center">
                                    <div>
                                        <a
                                            className="mb-4 bg-primary "
                                            href="#"
                                        ></a>
                                        <Button
                                            className="bg-primary rounded w-full"
                                            onClick={() => MySignOut()}
                                        >
                                            ออกจากระบบ
                                        </Button>
                                    </div>
                                </div>
                            )}
                            {session == undefined && (
                                <div className="lg:hidden flex flex-col">
                                    <Link href="/signup">
                                        <a
                                            href="#"
                                            className="mb-4"
                                            onClick={() => setIsOpen(false)}
                                        >
                                            ลงทะเบียน
                                        </a>
                                    </Link>
                                    <a
                                        href="#"
                                        className="mb-4"
                                        onClick={() => {
                                            signIn(), setIsOpen(false);
                                        }}
                                    >
                                        เข้าสู่ระบบ
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                    <div
                        className="lg:hidden w-2/5 bg-black opacity-50"
                        onClick={() => setIsOpen(false)}
                    ></div>
                </div>

                {(ref) => console.log("ref", ref)}
            </Transition>
        </div>
    );
}
