import axios from "axios";
import { numberFormat } from "../utils/numberFormat";
import { MasterDataService } from "./masterDataService";

const instance = axios.create({
    baseURL: process.env.BASE_URL,
});

const paymentWithOmise = async (params = {}) => {
    console.log('param ->>>>>>>>>>>>>>>>',params);
    return instance.post("/api/checkOutWithOmise", {
        params
    })
}

export const API = {
    instance,
    paymentWithOmise
}

