import axios from "axios";
import { numberFormat } from "../utils/numberFormat";
import { MasterDataService } from "./masterDataService";
import { getCoverImages, getGalleries } from '../utils/coverImages';
import moment from "moment";

const FormData = require('form-data');

const instance = axios.create({
    baseURL: process.env.API_URL,
});

const nextApi = axios.create({
    baseURL: process.env.NEXTAUTH_URL,
});

const init = (session) => {
    if (session)
        instance.defaults.headers.common['Authorization'] = "bearer " + session.accessToken;
}

const getProfile = async (params = {}) => {
    let result = await instance.get("/users/me", {
        params: {
            populate: "photo,address,shippingAddress,bankAccount.bank",
            ...params
        }
    })

    if (result.data.photo) {
        result.data.picture = assetUrl(result.data.photo.url)
    }

    return result
}

const patchProfile = (data = {}) => {
    if(data.dateOfBirth){
        if( moment(data.dateOfBirth).format('dddd') === 'Wednesday' || moment(data.dateOfBirth).format('dddd') === 'พุธ' ){
            if(data.dateOfBirthType){
                if(["day", "night"].indexOf(data.dateOfBirthType)===-1){
                    delete data.dateOfBirthType
                }
            }
        }else{
            delete data.dateOfBirthType
        }
    }else{
        delete data.dateOfBirthType
    }
    
    return instance.post("/users/updateProfile", { data })
}

const uploadProfileImage = (file) => {
    let formData = new FormData()
    formData.append("files", file)
    return instance.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data", }
    }).then(result => result.data[0])
}

const postProfile = (data = {}) => {
    return instance.post("/auth/me", data)
}

const deleteProfile = (id) => {
    return instance.delete("/users/" + id)
}

const forgotPassword = (data = {}) => {
    return instance.post("/auth/forgot-password", data)
}

const resetPassword = (data = {}) => {
    return instance.post("/auth/reset-password", data)
}

const getProducts = (params = {}) => {
    return instance.get("/products", {
        params: {
            populate: "galleries,coverImages.image,categories",
            ...params,
        }
    }).then(result => result.data)
}

const getproductsRecommendForYou = (params = {}) => {
    return instance.get("/products-recommend-for-you", {
        params: {
            ...params,
        }
    }).then(result => result.data)
}

const getProductById = async (id, params = {}) => {
    let result = await instance.get("/products/" + id, {
        params: {
            populate: "galleries,coverImages.image,categories,place,place.galleries,place.coverImages.image,sacredTypes,place.province",
            ...params,
        }
    }).then(result => result.data.data)

    if (result.attributes?.categories?.data.length > 0) {
        result.attributes.categories = result.attributes?.categories?.data[0]?.attributes
    }


    if (result.attributes.place?.data) {
        result.attributes.place = { id: result.attributes.place?.data?.id, ...result.attributes.place?.data?.attributes }
    } else {
        result.attributes.place = null
    }

    result.attributes.galleries = result.attributes.galleries.data
    result.attributes.coverImages = result.attributes.coverImages
    result.attributes.id = result.id

    return result
}

const getProductsWithFormat = async (params = {}) => {

    let result = await API.getProducts(params)
    let data = result.data;
    let items = data.map(o => {
        let price = o.attributes.price
        if (o.attributes.promotionPrice) {
            price = o.attributes.promotionPrice
        }

        let thumbnail = getCoverImages(o.attributes.coverImages, "pc")

        return {
            id: o.id,
            thumbnail,
            // title: o.attributes.fullname,
            // subTitle: o.attributes.name,
            title: o.attributes.fullname,
            subTitle: MasterDataService.productTypes(o.attributes.type)?.name,
            description: `ราคา ${numberFormat(price)} บาท / ชุด`,
            url: `/packages/${o.id}`,
        }
    })

    return items
}

const getInterestingPackages = async (params = {}) => {

    let result = await instance.get("/products/interesting-packages", {
        params: {
            ...params,
        }
    }).then(result => result.data)

    let data = result.data;
    let items = data.map(o => {
        let price = o.attributes.price
        if (o.attributes.promotionPrice) {
            price = o.attributes.promotionPrice
        }

        let thumbnail = getCoverImages(o.attributes.coverImages, "pc")

        return {
            id: o.id,
            thumbnail,
            title: o.attributes.fullname,
            subTitle: MasterDataService.productTypes(o.attributes.type)?.name,
            description: `ราคา ${numberFormat(price)} บาท / ชุด`,
            url: `/packages/${o.id}`,
        }
    })

    return items
}

const getInterestingProducts = async (params = {}) => {

    let result = await instance.get("/products/interesting-products", {
        params: {
            ...params,
        }
    }).then(result => result.data)

    let data = result.data;
    let items = data.map(o => {
        let price = o.attributes.price
        if (o.attributes.promotionPrice) {
            price = o.attributes.promotionPrice
        }

        let thumbnail = getCoverImages(o.attributes.coverImages, "pc")

        return {
            id: o.id,
            thumbnail,
            title: o.attributes.fullname,
            subTitle: MasterDataService.productTypes(o.attributes.type)?.name,
            description: `ราคา ${numberFormat(price)} บาท / ชุด`,
            url: `/packages/${o.id}`,
        }
    })

    return items
}

const getHolysticks = async (params = {}) => {
    let result = await instance.get("/holysticks", {
        params: {
            populate: "place,place.coverImages.image",
            ...params,
        }
    })

    let data = result.data.data
    let items = data.map(o => {
        // console.log(o);
        let coverImages = o.attributes.place.data.attributes.coverImages[0].image.data.attributes.url
        return {
            id: o.id,
            thumbnail: coverImages ? API.assetUrl(coverImages) : "/images/e-fortune/thumbs.png",
            title: o.attributes.name,
            subTitle: "เสี่ยงเซียมซีออนไลน์",
            url: `/e-fortune/${o.id}`,
        }
    })

    return items;
}

const getHolystickById = async (id, params = {}) => {
    let result = await instance.get("/holysticks/" + id, {
        params: {
            populate: "predictions,place,place.sacredTypes,place.galleries,place.coverImages,place.coverImages.image",
            ...params,
        }
    }).then(result => result.data.data)

    if (result.attributes.place) {
        result.attributes.place = result.attributes.place.data.attributes
        result.attributes.place.galleries = result.attributes.place.galleries.data
        if (result.attributes.place.coverImages.length > 0) {
            result.attributes.place.coverImages = result.attributes.place.coverImages[0].image.data.attributes.url
        }
    }

    // console.log(result);
    return result
}

const getHolystickByPlaceId = async (placeId, params = {}) => {
    let result = await instance.get("/holysticks", {
        params: {
            'filters[place][id]': placeId,
            populate: "predictions,place,place.galleries,place.coverImages,place.coverImages.image",
            ...params,
        }
    }).then(result => result.data.data[0])

    if (!result) return null;
    if (result.attributes?.place?.data?.attributes) {
        result.attributes.place = result.attributes?.place?.data?.attributes
        result.attributes.place.galleries = result.attributes.place.galleries.data
        result.attributes.place.coverImages = result.attributes.place.coverImages[0].image.data.attributes.url
    }
    //console.log(result);
    return result
}

const postAuthEmailConfirm = (data = {}) => {
    return instance.post("/auth/email-confirmation", data)
}

const postSendEmailConfirmation = (data = {}) => {
    return instance.post("/auth/send-email-confirmation", data)
}

const getPlaces = async (params = {}) => {
    let result = await instance.get("/places", {
        params: {
            'filters[hasDonation]': true,
            populate: "populate=bankAccounts.bank,coverImages.image",
            ...params,
        }
    })

    let data = result.data.data
    let items = data.map(o => {
        let coverImages = o.attributes.coverImages[0].image.data.attributes.url
        return {
            id: o.id,
            thumbnail: coverImages ? API.assetUrl(coverImages) : "/images/e-fortune/thumbs.png",
            title: o.attributes.name,
            // subTitle: "เสี่ยงเซียมซี",
            url: `/e-donation/${o.id}`,
        }
    })

    // return items;
    return items
}

const getBanks = async (params = {}) => {
    let result = await instance.get("/banks", {
        params: {
            ...params,
        }
    })

    return result.data
}

const getDonateReason = async () => {
    let result = await instance.get("/donation-reasons")
    return result.data.data
}

const getPlaceById = async (id, params = {}) => {
    let result = await instance.get("/places/" + id, {
        params: {
            populate: "galleries,coverImages.image,categories,bankAccounts.bank,sacredTypes,tags,province",
            ...params,
        }
    }).then(result => result.data.data)

    result.attributes.categories ? result.attributes.categories.data[0].attributes : ""
    result.attributes.galleries = result.attributes.galleries.data
    result.attributes.coverImages = result.attributes.coverImages
    result.attributes.tags = result.attributes.tags?.data
    // console.log(result);
    return result
}

const getSearch = (keyword) => {
    // return nextApi.get("/api/search", {
    //     params: {
    //         keyword
    //     }
    // })
    return instance.get("/search", {
        params: {
            keyword
        }
    }).then(result => result.data)
}


const getHome = (params) => {
    return instance.get("/home", {
        params
    }).then(result => result.data.data)
}

const getColorForYou = (params) => {
    return instance.get("/color-for-you", {
        params
    }).then(result => result.data.data)
}

const getHoroscope = (params) => {
    return instance.get("/horoscope", {
        params
    }).then(result => result.data.data)
}

const register = (data = {}) => {
    return instance.post("/auth/local/register", data)
}

const createOrder = (data = {}) => {
    return instance.post("/users/me/orders", data).then(result => result.data?.data)
}

const getOrders = (params = {}) => {
    return instance.get("/users/me/orders", {
        params
    }).then(result => result.data)
}

const liffProfile = () => {
    return instance.get("/liff/profile").then(result => result.data)
}
const liffSummary = (params = {}) => {
    return instance.get("/liff/summary", {
        params
    }).then(result => result.data)
}
const getPartnerOrders = (params = {}) => {
    return instance.get("/liff/orders", { params }).then(result => result.data)
}

const getPartnerCompleteOrders = (params = {}) => {
    return instance.get("/liff/complete-orders", { params }).then(result => result.data)
}

const getPartnerOrder = (id) => {
    return instance.get("/liff/orders/" + id).then(result => result.data)
}

const partnerOrder_Complete = (orderId) => {
    return instance.post("/liff/orders/" + orderId + "/complete").then(result => result.data)
}
const partnerOrder_AddEvidenceOfAction = (orderId, mediaId) => {
    return instance.post("/liff/orders/" + orderId + "/evidence-of-actions", {
        image: mediaId
    }).then(result => result.data)
}
const partnerOrder_DeleteEvidenceOfAction = (orderId, mediaId) => {
    return instance.delete("/liff/orders/" + orderId + "/evidence-of-actions/" + mediaId).then(result => result.data)
}
const partnerOrder_GetEvidenceOfAction = (orderId) => {
    return instance.get("/liff/orders/" + orderId + "/evidence-of-actions").then(result => result.data)
}

const getOrder = async (orderId) => {
    let order = await instance.get("/orders/" + orderId).then(result => result.data)

    if (order.type == "donation") {
        return null
        order.orderItem = order.orderItems[0]
        order.place = order.orderItems[0].place
    } else {
        order.orderItem = order.orderItems[0]
        order.product = order.orderItems[0].product
    }

    return order
}

const getPageBySlug = async (slug) => {
    let data = await instance.get("/pages", {
        params: {
            'filters[slug]': slug
        }
    }).then(result => result.data.data)
    if (data.length == 0) {
        throw new Error("Page not found")
    }
    let page = data[0].attributes
    page.id = data[0].id
    return page
}

const orderPayment = (orderId, body = {}) => {
    return instance.post("/orders/" + orderId + "/payment", body).then(result => result.data)
}

const orderPaymentBank = (orderId, mediaId) => {
    return instance.post("/orders/" + orderId + "/payment", {
        type: "bank",
        bank: {
            image: mediaId
        }
    }).then(result => result.data)
}

const orderAddEvidenceOfAction = (orderId, mediaId) => {
    return instance.post("/orders/" + orderId + "/evidence-of-actions", {
        image: mediaId
    }).then(result => result.data)
}

const orderPaymentOmise = (orderId, omiseToken) => {
    return instance.post("/orders/" + orderId + "/payment", {
        type: "omise",
        omise: {
            token: omiseToken
        }
    }).then(result => result.data)
}

const cancelOrder = (orderId) => {
    return instance.delete("/orders/" + orderId).then(result => result.data?.data)
}

const getAppCongfig = async () => {
    let appConfig = await instance.get("/app-config", {
        params: {
            populate: "bankAccounts.bank"
        }
    }).then(result => result.data?.data?.attributes)
    .then(result => {
        if(result?.popupPromotions){
            result?.popupPromotions.forEach(item=>{
                if(item.url){
                    if(item.url == "app:login"){
                        item.url = "/login"
                    }
                }
            })
        }
        return result
    })

    return appConfig
}

const getLive = async () => {
    let lives = await instance.get("/lives/live", {
        params: {
            populate: ""
        }
    }).then(result => result.data?.data)

    console.log("lives--->", lives);
    return lives
}
const getLiveById = async (id) => {
    let live = await instance.get(`/lives/live/${id}`, {
        params: {
            populate: ""
        }
    }).then(result => result.data)

    console.log("live--->", live);
    return live
}
const apiUrl = (text) => {
    return `${process.env.API_URL}${text}`
}

const assetUrl = (text) => {
    return `${process.env.ASSET_URL}${text}`
}

const getNotification = (id) => {
    return instance.get("/notifications/"+id)
}

const getUnread = () => {
    return instance.get("/notifications/unread")
}

const readAll = () => {
    return instance.patch("/notifications/read-all")
}

const updateOrder = (orderId, body = {}) => {
    // console.log('api service update order orderId----> ',orderId);
    // console.log('api service update order order body ----> ',body);
    return instance.put(`/orders/${orderId}`, body).then(result => result.data?.order);
}

const getCartCount = () => {
    return instance.get("/users/me/cart-count")
}

const getMenus = async () => {
    let items = await instance.get("/menus?populate=*&nested").then(result => result?.data?.data).then(data=>data.map(o=>o.attributes))
    let menus = {}
    items.forEach(o=>{
        o.items = o.items.data.map(o=>o.attributes)
        menus[o.slug] = o
    })
    return menus
}

const getPendingPartnerOrders = (params = {}) => {
    return instance.get("/liff/pending-orders").then(result => result.data)
}
const partnerOrder_Accepted = (orderId) => {
    return instance.post("/liff/orders/" + orderId + "/accept").then(result => result.data)
}

const getSupplement = async (params) => {
    return instance.get("/supplement", {
        params
    }).then(result => result.data.data)
}

export const API = {
    instance,
    init,
    getProfile,
    patchProfile,
    postProfile,
    uploadProfileImage,
    deleteProfile,
    forgotPassword,
    resetPassword,
    getProducts,
    getProductById,
    getHolysticks,
    getHolystickById,
    getProductsWithFormat,
    postAuthEmailConfirm,
    getPlaces,
    getPlaceById,
    getSearch,
    getHome,
    apiUrl,
    assetUrl,
    register,
    postSendEmailConfirmation,
    getHolystickByPlaceId,
    getproductsRecommendForYou,
    getInterestingPackages,
    getInterestingProducts,
    getColorForYou,
    getHoroscope,
    getDonateReason,
    createOrder,
    getAppCongfig,
    getOrders,
    getOrder,
    cancelOrder,
    orderPayment,
    orderPaymentBank,
    orderPaymentOmise,
    getPageBySlug,
    getPartnerOrders,
    getPartnerCompleteOrders,
    getPartnerOrder,
    liffProfile,
    getLive,
    getLiveById,
    partnerOrder_Complete,
    partnerOrder_AddEvidenceOfAction,
    partnerOrder_DeleteEvidenceOfAction,
    partnerOrder_GetEvidenceOfAction,
    getBanks,
    liffSummary,
    getUnread,
    readAll,
    updateOrder,
    getCartCount,
    getMenus,
    getPendingPartnerOrders,
    partnerOrder_Accepted,
    getSupplement,
    getNotification
}

