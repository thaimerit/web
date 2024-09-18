import React, { Fragment, useEffect, useState } from 'react';
import Head from 'next/head'
import Image from 'next/image'
import EventSection from '../components/event-section'
import MiniSlide from '../components/slides/mini-slide'
import MiniSlidePackage from '../components/slides/mini-slide-package'
import styles from '../styles/pages/Home.module.css'
import LineEnd from '../components/line-end';
import Containner from '../components/containner';
import YourColorOfTheDays from '../components/your-color-of-the-days/your-color-of-the-days';
import YourDailyHoroscope from '../components/your-daily-horoscope';
import { getSession, useSession } from 'next-auth/react';
import { API } from '../service/apiService';
import { numberFormat } from '../utils/numberFormat';
import { MasterDataService } from '../service/masterDataService';
import { checkUserActive } from '../utils/authUtil';
import { getCoverImages, getGalleries } from '../utils/coverImages';
import moment from 'moment';
import 'moment/locale/th'
moment.locale("th")
import { getPeriod } from '../utils/period';
import Supplement from '../components/supplement/supplement';

export default function Home({ session }) {

  // const { data: session } = useSession()
  const [sections, setSections] = useState({})
  const [loading, setLoading] = useState(true)

  const [recommendPackages, setRecommendPackages] = useState([])

  const [recommendByBirthdateTitle, setRecommendByBirthdateTitle] = useState(null)
  const [recommendByBirthdate, setRecommendByBirthdate] = useState([])

  const [recommendPlaces, setRecommendPlaces] = useState([])

  const [packages, setPackages] = useState([])

  const [holysticks, setHolysticks] = useState([])

  const [sacredObjects, setSacredObjects] = useState([])

  const [onlineMerit, setOnlineMerit] = useState([])

  const [colors, setColors] = useState([])

  const [horoscope, setHoroscope] = useState(null)

  const [supplement, setSupplement] = useState(null)

  const [wishWork, setWishWork] = useState(null)
  const [wishMoney, setWishMoney] = useState(null)
  const [wishLove, setWishLove] = useState(null)

  useEffect(() => {
    API.init(session)
    initData()
  }, [])

  const initData = async () => {
    await getHome()
    if (session) {
      await getColors()
      await getOrder();
      await getHoroscope()
      await getSupplement();
    }
    setLoading(false)
  }

  const getHome = async () => {
    try {
      let homeData = await API.getHome({
      })

      let mySections = {}
      homeData.forEach(o => {
        mySections[o.slug] = true
      });
      setSections(mySections)

      let packageSection = homeData.find(o => o.slug == "packages")
      if (packageSection) {
        let items = packageSection.items.map(o => {

          let image = getGalleries(o.galleries, 0)
          let thumbnail = getCoverImages(o.coverImages, "pc", "thumbnail")

          if (!thumbnail) {
            thumbnail = image
          }

          let province = o.province?.name || ""

          return {
            id: o.id,
            image,
            thumbnail,
            title: `${o.highlightName}`,
            subTitle: o.templeName + " " + province,
            coverTitle: o.coverTitle,
            // description: o.highlightName,
            url: `/places/${o.id}`,
          }
        })

        // console.log(items)
        setRecommendPackages(items)
      }

      let recommendPlacesSection = homeData.find(o => o.slug == "recommend-places")
      if (recommendPlacesSection) {
        let items = recommendPlacesSection.items.map(o => {

          let province = o.province?.name || ""

          return {
            id: o.id,
            thumbnail: getCoverImages(o.coverImages, "pc", "medium"),
            title: `${o.highlightName}`,
            subTitle: o.templeName + " " + province,
            url: `/places/${o.id}`,
          }
        })
        setRecommendPlaces(items)
      }

      let topMakeMeritPackageSection = homeData.find(o => o.slug == "recommend-make-merit-packages")
      if (topMakeMeritPackageSection) {
        let items = topMakeMeritPackageSection.items.map(o => {
          return {
            id: o.id,
            thumbnail: getCoverImages(o.coverImages, "pc", "medium"),
            title: o.fullname,
            subTitle: MasterDataService.productTypes(o.type)?.name,
            description: `ราคา ${numberFormat(o.price)} บาท / ชุด`,
            url: `/packages/${o.id}`,
          }
        })
        setPackages(items)
      }
      let wishWorkSection = homeData.find(o => o.slug == "tags-work")
      if (wishWorkSection) {
        let items = wishWorkSection.items.map(o => {

          let province = o.province?.name || ""

          return {
            id: o.id,
            thumbnail: getCoverImages(o.coverImages, "pc", "medium"),
            title: `${o.highlightName}`,
            subTitle: o.templeName + " " + province,
            url: `/places/${o.id}`,
          }
        })
        setWishWork(items)
      }

      let wishMoneySection = homeData.find(o => o.slug == "tags-money")
      if (wishMoneySection) {
        let items = wishMoneySection.items.map(o => {

          let province = o.province?.name || ""

          return {
            id: o.id,
            thumbnail: getCoverImages(o.coverImages, "pc", "medium"),
            title: `${o.highlightName}`,
            subTitle: o.templeName + " " + province,
            url: `/places/${o.id}`,
          }
        })
        setWishMoney(items)
      }

      let wishLoveSection = homeData.find(o => o.slug == "tags-love")
      if (wishLoveSection) {
        let items = wishLoveSection.items.map(o => {

          let province = o.province?.name || ""

          return {
            id: o.id,
            thumbnail: getCoverImages(o.coverImages, "pc", "medium"),
            title: `${o.highlightName}`,
            subTitle: o.templeName + " " + province,
            url: `/places/${o.id}`,
          }
        })
        setWishLove(items)
      }

      let holysticsSection = homeData.find(o => o.slug == "holystick")
      if (holysticsSection) {
        let items = holysticsSection.items.map(o => {

          return {
            id: o.id,
            thumbnail: getCoverImages(o.place.coverImages, "pc", "medium"),
            title: o.name,
            subTitle: "เสี่ยงเซียมซีออนไลน์",
            url: `/e-fortune/${o.id}`,
          }
        })
        setHolysticks(items)
      }

      let recommendProductBirthdateSection = homeData.find(o => o.slug == "recommend-birthday")
      if (recommendProductBirthdateSection) {
        setRecommendByBirthdateTitle(recommendProductBirthdateSection.name)
        let items = recommendProductBirthdateSection.items.map(o => {

          let province = o.province?.name || ""

          return {
            id: o.id,
            thumbnail: getCoverImages(o.coverImages, "pc", "medium"),
            title: `${o.highlightName}`,
            subTitle: o.templeName + " " + province,
            url: `/places/${o.id}`,
          }
        })
        setRecommendByBirthdate(items)
      }

      let recommendProductSection = homeData.find(o => o.slug == "recommend-product")
      if (recommendProductSection) {
        let items = recommendProductSection.items.map(o => {
          return {
            id: o.id,
            thumbnail: getCoverImages(o.coverImages, "pc", "medium"),
            title: o.fullname,
            subTitle: MasterDataService.productTypes(o.type)?.name,
            description: `ราคา ${numberFormat(o.price)} บาท / ชุด`,
            url: `/products/${o.id}`,
          }
        })
        setSacredObjects(items)
      }

    } catch (error) {
      console.error(error)
    }
  }

  const getColors = async () => {
    try {
      let colors = await API.getColorForYou({
      })
      setColors(colors)
    } catch (error) {

    }
  }

  const getHoroscope = async () => {
    try {
      let horoscope = await API.getHoroscope({
      })
      // console.log('horoscope',horoscope);
      if (horoscope) {
        setHoroscope(horoscope.detail)
      }
    } catch (error) {

    }
  }

  const getOrder = async () => {
    try {
      let orders = await API.getOrders({
        'filters[paymentStatus]': "purchase",
        'filters[status]': "approve",

      })
      if (orders) {
        let items = orders.data.map(o => {
          let description = ""

          if (o.type == "package") {
            description += `${moment(o.orderItem.date).add(543, "year").format("DD MMMM YYYY")} ${getPeriod(o.orderItem.period)}<br>`
          }
          description += `${o.orderItem.qty} ชุด ราคา ${numberFormat(o.sum)} บาท`

          return {
            id: o.id,
            thumbnail: getCoverImages(o.product.coverImages, "pc", "medium"),
            title: o.product.fullname,
            subTitle: MasterDataService.productTypes(o.product.type)?.name,
            description,
            url: `/transactions/${o.id}`,
          }
        })
        setOnlineMerit(items);
      }
    } catch (error) {
      console.log(error)
    }
  }

  const getSupplement = async () => {
    try {
      let supplement = await API.getSupplement({
      })
      // console.log('supplement',supplement);
      if (supplement) {
        setSupplement(supplement.detail)
      }
    } catch (error) {

    }
  }

  return (
    <div className="my-10" >

      {loading && <>
        <EventSection loading={true} data={[{
          id: "",
          image: "",
          thumbnail: "",
          title: "",
          subTitle: "",
          coverTitle: "",
          url: "#",
        }]} />
        <MiniSlidePackage loading={true} className="mt-5" />
      </>}

      {sections?.packages && <EventSection loading={loading} data={recommendPackages} subTitle={<><div className=''>กิจกรรม</div><div style={{ color: "black" }}>แนะนำสำหรับคุณ</div></>} />}

      {(session && recommendByBirthdate.length > 0 && sections['recommend-birthday']) && <Fragment>
        <MiniSlidePackage loading={loading} className="mt-5" title={recommendByBirthdateTitle} data={recommendByBirthdate} />
      </Fragment>}

      {sections['recommend-places'] && <MiniSlidePackage showAll={"/places"} loading={loading} className="mt-5" title="สถานที่ศักดิ์สิทธิ์แนะนำ" data={recommendPlaces} />}

      {/* {sections['recommend-make-merit-packages'] && <MiniSlidePackage showAll={"/e-merit"} loading={loading} className="mt-5" title="ชุดขอพร-แก้บนยอดนิยม" data={packages} />} */}

      {sections['tags-work'] && <MiniSlide loading={loading} className="mt-5" title="ขอพร - แก้บน เรื่องการงาน " data={wishWork} />}

      {sections['tags-money'] && <MiniSlide loading={loading} className="mt-5" title="ขอพร - แก้บน เรื่องการเงิน " data={wishMoney} />}

      {sections['tags-love'] && <MiniSlide loading={loading} className="mt-5" title="ขอพร - แก้บน เรื่องความรัก " data={wishLove} />}

      {sections['holystick'] && <MiniSlide showAll={"/e-fortune"} loading={loading} className="mt-5" title="เสี่ยงเซียมซีออนไลน์" data={holysticks} />}

      {(sections['recommend-product'] && sacredObjects) && <MiniSlide showAll={"/products"} loading={loading} className="mt-5" title="สินค้ามงคลยอดนิยม" data={sacredObjects} />}

      {session && <Fragment>
        {/* <MiniSlide onlineMerit={true} loading={loading} className="mt-5" title="รายการทำบุญออนไลน์ของคุณ" data={onlineMerit} /> */}

        {/* <MiniSlidePackage showAll={"/transactions"} loading={loading} className="mt-5" title="รายการทำบุญออนไลน์ของคุณ" data={onlineMerit} /> */}


        <Containner className="my-10"><LineEnd /></Containner>

        <Containner className="mb-5">
          {supplement && <Supplement text={supplement} />}
        </Containner>

        <Containner className="mb-5">
          {horoscope && <YourDailyHoroscope text={horoscope} />}
        </Containner>

        {/* <Containner className='grid md:grid-cols-2 gap-y-5'>
          {colors && <YourColorOfTheDays colors={colors} />}
          {horoscope && <YourDailyHoroscope text={horoscope} />}
        </Containner> */}
      </Fragment>}
    </div>
  )
}

export async function getServerSideProps(context) {
  const session = await getSession(context)

  let check = await checkUserActive(context, session);
  if (check) {
    return check;
  }

  return {
    props: {
      session
    },
  }
}