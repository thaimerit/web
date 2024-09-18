import axios from "axios";
import { API_URL, AUTH_EMAIL_REGISTER_URL } from "../../../../utils/api";

const handler = async (req, res) => {
    res.redirect(API_URL("/liff/auth"))
}

export default handler;