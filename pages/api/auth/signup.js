import axios from "axios";
import { errorHandler } from "../../../utils/alertUtil";
import { AUTH_EMAIL_REGISTER_URL } from "../../../utils/api";
import { csrf } from "../../../utils/csrf";

const handler = async (req, res) => {
    if (req.method === 'POST') {
        try {
            let result = await axios.post(AUTH_EMAIL_REGISTER_URL(), req.body)
            return res.status(200).json({
                status: "ok"
            })
        } catch (error) {

            console.log("error-->", error.response)

            try {
                let errorMessage = errorHandler(error)
                throw new Error(errorMessage)
            } catch (error) {
                return res.status(400).json({
                    message: error.message
                })
            }
            return res.status(400).json({
                message: "เกิดข้อผิดพลาด"
            })
        }
    }
    res.status(404)
}

export default csrf(handler);