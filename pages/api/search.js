// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import axios from "axios"
import { getToken } from "next-auth/jwt"
import { GET_PLACES, GET_PRODUCTS } from "../../utils/api"
const secret = process.env.NEXTAUTH_SECRET

export default async function handler(req, res) {
    const {
        query: { keyword },
        method,
    } = req

    const token = await getToken({ req, secret })

    if (method == "GET") {

        let places = []
        let packages = []
        let products = []

        if (keyword!="" && keyword) {
            places = await axios.get(GET_PLACES(), {
                params: {
                    'filters[fullname][$contains]': keyword
                }
            })
            .then(result=>result.data.data)
            .then(items=>items.map(o=>({id:o.id, ...o.attributes})))

            packages = await axios.get(GET_PRODUCTS(), {
                params: {
                    'filters[type]': 'package',
                    'filters[name][$contains]': keyword
                }
            })
            .then(result=>result.data.data)
            .then(items=>items.map(o=>({id:o.id, ...o.attributes})))

            products = await axios.get(GET_PRODUCTS(), {
                params: {
                    'filters[type]': 'product',
                    'filters[name][$contains]': keyword
                }
            })
            .then(result=>result.data.data)
            .then(items=>items.map(o=>({id:o.id, ...o.attributes})))
        }

        return res.status(200).json({ keyword, places, packages, products })
    }

    res.status(404).end(`Method ${method} Not Found`)
}
