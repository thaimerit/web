import axios from "axios";
import { API } from "../../../../service/apiService";

const handler = async (req, res) => {

    let csrfToken = await API.getCsrf()

    let login = await API.postLogin({
        csrfToken,
        email : "xxx@mail.com",
        password : "xxx@mail.com",
    })

    // API.postLogin()
    // /api/auth/csrf

    res.json(req.query)
}

export default handler;