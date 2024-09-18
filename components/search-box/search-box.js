import Link from 'next/link'
import React, { useEffect, useMemo } from 'react'
import _ from 'lodash'
import styles from '../../styles/search-box/SearchBox.module.scss'
import navbarStyles from "../../styles/Navbar.module.scss";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { API } from '../../service/apiService';
import { useRouter } from 'next/router';

function ResultBox({ className, items, onClose, resultPlaces, resultPackages, resultHolysticks, keyword }) {
    let showResults = keyword && keyword != undefined

    return <>
        <div className={styles.resultBoxWrapper + " " + className}>
            {showResults && <div className={'rounded-lg drop-shadow-md bg-white w-full relative ' + styles.resultBox} >
                <div className="w-full hidden lg:block text-right mb-4 absolute top-0 right-0">
                    <button className={styles.resultBoxCloseBtnMini} onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
                </div>
                <div>
                    <div>
                        สถานที่ศักดิ์สิทธิ์ / สิ่งศักดิ์สิทธิ์
                    </div>
                    <div>
                        {resultPlaces.length == 0 && <div className='flex items-center justify-center border-b-gray-200 border-b py-4 text-gray-400'>
                            ไม่มีข้อมูล
                        </div>}
                        {resultPlaces.map((o, key) => <div key={key} className='flex items-center border-b-gray-200 border-b py-4'>
                            <div className='bg-gray-200 rounded-lg w-10 h-10 text-gray-700 flex justify-center items-center text-xl mr-2'><i className="fa-solid fa-location-dot"></i></div>
                            <Link href={o.url}><a onClick={e => {
                                onClose(false)
                            }}>{o.title}</a></Link>
                        </div>)}
                    </div>
                </div>

                <div className='mt-4'>
                    <div>
                        ขอพร-แก้บนออนไลน์
                    </div>
                    <div>
                        {resultPackages.length == 0 && <div className='flex items-center justify-center border-b-gray-200 border-b py-4 text-gray-400'>
                            ไม่มีข้อมูล
                        </div>}
                        {resultPackages.map((o, key) => <div key={key} className='flex items-center border-b-gray-200 border-b py-4'>
                            <div className='bg-gray-200 rounded-lg w-10 h-10 text-gray-700 flex justify-center items-center text-xl mr-2'>
                                <ShoppingBasketIcon />
                            </div>
                            <Link href={o.url}><a>{o.title}</a></Link>
                        </div>)}
                    </div>
                </div>

                <div className='mt-4'>
                    <div>
                        เสี่ยงเซียมซีออนไลน์
                    </div>
                    <div>
                        {resultHolysticks.length == 0 && <div className='flex items-center justify-center border-b-gray-200 border-b py-4 text-gray-400'>
                            ไม่มีข้อมูล
                        </div>}
                        {resultHolysticks.map((o, key) => <div key={key} className='flex items-center border-b-gray-200 border-b py-4'>
                            <div className='bg-gray-200 rounded-lg w-10 h-10 text-gray-700 flex justify-center items-center text-xl mr-2'>
                                <AutoFixHighIcon />
                            </div>
                            <Link href={o.url}><a>{o.title}</a></Link>
                        </div>)}
                    </div>
                </div>

            </div>}
        </div></>
}

function ResultBoxMini({ show, items, className, keyword, onChangeKeyword, onClose, onKeyDown, resultPlaces, resultPackages, resultHolysticks }) {

    React.useEffect(() => {
        if (!show && keyword == "") {
            document.body.classList.remove("search-show");

            return () => { }
        }

        document.body.classList.add("search-show");

        return () => { }
    }, [show, keyword])

    if (!show && keyword == "") {
        return <></>
    }

    return <>
        <div className={styles.resultBoxMiniWrapper + " " + className}>
            <div className="w-full lg:hidden block text-right mb-4">
                <button className={styles.resultBoxCloseBtn} onClick={onClose}><i className="fa-solid fa-xmark"></i></button>
            </div>

            <SearchInput className="mb-4 w-full lg:hidden block" value={keyword} onChange={onChangeKeyword} onKeyDown={onKeyDown}/>

            <ResultBox items={items} resultPlaces={resultPlaces} resultPackages={resultPackages} resultHolysticks={resultHolysticks} keyword={keyword} />

        </div><div className={styles.resultBoxBackdrop}></div>
    </>
}

function SearchInput({ className, value, onChange, onKeyDown, searchOption }) {

    const onKeywordChange = (event) => {
        onChange(event.target.value)
    }

    return (<div className={"relative text-gray-600 border border-gray-200 rounded-full " + className}>
        <button type="submit" className="absolute left-0 bottom-1/2 translate-y-1/2 ml-4 text-primary">
            <i className="fa-solid fa-magnifying-glass"></i>
        </button>
        <input type="search" name="serch" placeholder={searchOption?.placeholder} className="bg-white h-10 px-5 pl-10 rounded-full w-full text-sm focus:outline-none" value={value} onChange={onKeywordChange} onKeyDown={onKeyDown} />
    </div>)
}

function SearchBtnMini({ onClick }) {
    return <button onClick={onClick} type="submit" className={" lg:hidden block " + styles.searchButtonMini}>
        <i  className={navbarStyles.iconBox + " fa-solid fa-magnifying-glass"}></i>
    </button>
}

const searchOptionDefault = {
    placeholder: "ค้นหาสถานที่ศักดิ์สิทธิ์ / ขอพร แก้บน",
    searchSlug: null
}

export default function SearchBox({ children }) {

    const [keyword, setKeyword] = React.useState("")
    const [results, setResults] = React.useState([])
    const [resultPlaces, setResultPlaces] = React.useState([])
    const [resultPackages, setResultPackages] = React.useState([])
    const [resultHolysticks, setResultHolysticks] = React.useState([])
    const [searchOption, setSearchOption] = React.useState({
        placeholder: "ค้นหาสถานที่ศักดิ์สิทธิ์ / ขอพร แก้บน"
    })
    const router = useRouter()

    useEffect(() => {

        try {

            const paths = router.pathname.split("/")
            let pathOne = paths[1]
            if (pathOne == "search") {
                if (paths[2] == "[searchSlug]") {
                    if (router.query.searchSlug) {
                        let searchSlug = router.query.searchSlug
                        switch (searchSlug) {
                            case "packages":
                                pathOne = "e-merit"
                                break;
                            case "holysticks":
                                pathOne = "e-fortune"
                                break;
                            case "products":
                                pathOne = "products"
                                break;
                            default:
                                break;
                        }
                    }
                }
            }
            switch (pathOne) {
                case "e-merit":
                    setSearchOption(() => ({
                        placeholder: "ค้นหาขอพร แก้บน",
                        searchSlug: "packages"
                    }))
                    break;

                case "e-fortune":
                    setSearchOption(() => ({
                        placeholder: "ค้นหาเสี่ยงเซียมซีออนไลน์",
                        searchSlug: "holysticks"
                    }))
                    break;
                case "products":
                    setSearchOption(() => ({
                        placeholder: "ค้นหาสินค้ามงคล",
                        searchSlug: "products"
                    }))
                    break;

                default:
                    setSearchOption(() => ({
                        ...searchOptionDefault
                    }))
                    break;
            }

        } catch (error) {

        }

    }, [router.pathname])

    const [showResultFull, setShowResultFull] = React.useState(false)

    const debounceFun = useMemo(() => _.debounce(async function (text) {
        // if (text) {
        //     if (searchOption.searchSlug) {
        //         router.push(`/search/${searchOption.searchSlug}?keyword=${text}`)
        //     } else {
        //         router.push("/search?keyword=" + text)
        //     }
        // }

        console.log('Function debounced after 1000ms!', text);
        let result = await API.getSearch(text)
        console.log('result', result);

        let placeSection = result.sections.find(o=>o.slug=="places")
        let places = placeSection.results

        let packageSection = result.sections.find(o=>o.slug=="packages")
        let packages = packageSection.results

        let holystickSection = result.sections.find(o=>o.slug=="holysticks")
        let holysticks = holystickSection.results

        // let packages = result.data.packages
        // let products = result.data.products

        setResultPlaces(places.map(o => {
            return {
                id: o.id,
                title: o.highlightName,
                url: '/places/' + o.id,
            }
        }))

        setResultPackages(packages.map(o => {
            return {
                id: o.id,
                title: o.fullname,
                url: '/packages/' + o.id,
            }
        }))

        setResultHolysticks(holysticks.map(o => {
            return {
                id: o.id,
                title: o.name,
                url: '/e-fortune/' + o.id,
            }
        }))

        // setResults([
        //     ...places,
        //     ...packages,
        // ])

        // setResults([
        //     {
        //         type: "places",
        //         title: "สถานที่ศักดิ์สิทธิ์ / สิ่งศักดิ์สิทธิ์",
        //         result: places.map(o=>{
        //             return {
        //                 id : o.id,
        //                 title : o.name,
        //             }
        //         })
        //     },
        //     {
        //         type: "packages",
        //         title: "แพ็จเกจทำบุญออนไลน์",
        //         result: packages.map(o=>{
        //             return {
        //                 id : o.id,
        //                 title : o.name,
        //             }
        //         })
        //     }
        // ])

    }, 500), []);

    const onKeywordChange = (text) => {
        setKeyword(text)

        debounceFun(text)

        if (text != "") {

            // setResults([
            //     {
            //         type: "location",
            //         title: "สถานที่ศักดิ์สิทธิ์ / สิ่งศักดิ์สิทธิ์",
            //         result: [
            //             {
            //                 id: 1,
            //                 title: "วัดเล่งเน่ยยี่ • กรุงเทพฯ"
            //             },
            //             {
            //                 id: 2,
            //                 title: "วัดเล่งเน่ยยี่ • กรุงเทพฯ"
            //             }
            //         ]
            //     },
            //     {
            //         type: "package",
            //         title: "แพ็จเกจทำบุญออนไลน์",
            //         result: [
            //             {
            //                 id: 1,
            //                 title: "ไหว้พระขอพร วัดเล่งเน่ยยี่ กรุงเทพฯ • 199 บาท"
            //             },
            //             {
            //                 id: 2,
            //                 title: "ไหว้พระขอพร วัดเล่งเน่ยยี่ กรุงเทพฯ • 199 บาท"
            //             }
            //         ]
            //     }
            // ])

        } else {
            setResults([])
        }
    }

    const onCloseResult = (close) => {
        onKeywordChange("")
    }

    const toggleShowResultFull = () => {
        if (!showResultFull == false) {
            onKeywordChange("")
        }
        setShowResultFull(!showResultFull)
    }

    const onKeyDown = (e) => {
        if (e.keyCode == 13) {
            onCloseResult()
            if (searchOption.searchSlug) {
                router.push(`/search/${searchOption.searchSlug}?keyword=${keyword}`)
            } else {
                router.push("/search?keyword=" + keyword)
            }
        }
    }

    return (
        <div className={styles.searchBox}>
            <SearchInput className={" hidden lg:block "} value={keyword} onChange={onKeywordChange} onKeyDown={onKeyDown} searchOption={searchOption} />

            <SearchBtnMini onClick={toggleShowResultFull} />

            <ResultBoxMini show={showResultFull} onClose={toggleShowResultFull} onKeyDown={onKeyDown} className="lg:hidden block" items={results} resultPlaces={resultPlaces} resultPackages={resultPackages} resultHolysticks={resultHolysticks} keyword={keyword} onChangeKeyword={onKeywordChange} />

            <ResultBox className="hidden lg:block" keyword={keyword} items={results} resultPlaces={resultPlaces} resultPackages={resultPackages} resultHolysticks={resultHolysticks} onClose={onCloseResult} />
        </div>
    )
}