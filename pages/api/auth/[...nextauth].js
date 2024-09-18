import axios from "axios"
import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import FacebookProvider from "next-auth/providers/facebook";
import GoogleProvider from "next-auth/providers/google";
import * as moment from "moment"
import { AUTH_EMAIL_LOGIN_URL, AUTH_FACEBOOK_LOGIN_URL, AUTH_GOOGLE_LOGIN_URL, AUTH_LINE_LOGIN_URL, AUTH_REFRESH_URL, LIFF_PROFILE, USER_ME_URL } from "../../../utils/api"
import { errorHandler } from "../../../utils/alertUtil"
import LineProvider from "next-auth/providers/line";

async function parseAccessToken(data) {
    console.log("parseAccessToken", data)
    const user = data.user
    user.name = `${user.firstName} ${user.lastName}`
    // user.picture = `${user.photo}`

    user.accessToken = data.jwt
    user.refreshToken = data.jwt
    user.accessTokenExpires = +moment().add(1, "day").toDate()

    return user
}

async function refreshAccessToken(token) {
    try {

        let result = await axios.post(AUTH_REFRESH_URL(), {
            refreshToken: token.refreshToken
        })

        let data = result.data

        const user = await parseAccessToken(data)

        return {
            ...token,
            ...user
        }

    } catch (error) {
        console.log(error.response.data)

        return null
    }
}


export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        FacebookProvider({
            clientId: process.env.FACEBOOK_CLIENT_ID,
            clientSecret: process.env.FACEBOOK_CLIENT_SECRET
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET
        }),
        LineProvider({
            clientId: process.env.LINE_CLIENT_ID,
            clientSecret: process.env.LINE_CLIENT_SECRET,
        }),
        CredentialsProvider({
            // The name to display on the sign in form (e.g. 'Sign in with...')
            name: 'Credentials',
            // The credentials is used to generate a suitable form on the sign in page.
            // You can specify whatever fields you are expecting to be submitted.
            // e.g. domain, username, password, 2FA token, etc.
            // You can pass any HTML attribute to the <input> tag through the object.
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // You need to provide your own logic here that takes the credentials
                // submitted and returns either a object representing a user or value
                // that is false/null if the credentials are invalid.
                // e.g. return { id: 1, name: 'J Smith', email: 'jsmith@example.com' }
                // You can also use the `req` object to obtain additional parameters
                // (i.e., the request IP address)
                credentials.identifier = credentials.email
                delete credentials.email

                try {
                    let result = await axios.post(AUTH_EMAIL_LOGIN_URL(), credentials)

                    console.log("--result--->", result.data)

                    let data = result.data

                    const user = await parseAccessToken(data)

                    let userProfile = await axios.get(USER_ME_URL(), {
                        headers: {
                            Authorization: `Bearer ${user.accessToken}`
                        },
                        params: {
                            populate: "photo"
                        }
                    }).then(result => result.data)

                    user.picture = userProfile.photo ? process.env.ASSET_URL + userProfile.photo.url : null

                    user.liff = false

                    try {
                        let liffProfile = await axios.get(LIFF_PROFILE(), {
                            headers: {
                                Authorization: `Bearer ${user.accessToken}`
                            }
                        }).then(result => result.data)

                        console.log("--liffProfile--->", liffProfile)

                        if (liffProfile) {
                            user.liff = true
                        }
                    } catch (error) {
                        console.log("--liffProfile.error--->", error.response.data)
                    }

                    return user

                } catch (error) {
                    let errorMessage = errorHandler(error)
                    if (errorMessage == 'Your account email is not confirmed') {
                        throw new Error(encodeURIComponent(`อีเมลยังไม่ถูกยืนยัน <a href='/signup-confirm?email=${credentials.identifier}' class='font-bold'>ยืนยันอีเมลที่นี้</a>`))
                    }
                    throw new Error(errorMessage)
                }

                // Return null if user data could not be retrieved
                return null
            }
        })
    ],
    callbacks: {
        jwt: async ({ token, user, account, profile, isNewUser }) => {

            if (account) {

                console.log("--account.provider--->", { token, user, account, profile, isNewUser })

                switch (account.provider) {
                    case "facebook":
                        if (user) {

                            let [firstName, lastName] = user.name.split(" ")
                            token.firstName = firstName
                            token.lastName = lastName

                            let result = null
                            try {
                                result = await axios.get(AUTH_FACEBOOK_LOGIN_URL(), {
                                    params: {
                                        access_token: account.access_token,
                                    },
                                })
                                console.log("AUTH-->", result.data)
                            } catch (error) {
                                console.log("AUTH.ERROR-->", error.response?.data)
                            }

                            let data = result.data

                            user = await parseAccessToken(data)

                            token.id = user.id

                            if (user.firstName)
                                token.firstName = user.firstName || ""

                            if (user.lastName)
                                token.lastName = user.lastName || ""

                            if (user.picture && user.picture != "null")
                                token.picture = user.picture || ""

                            token.roleId = user.role?.id
                            token.roleName = user.role?.name
                            token.accessToken = user.accessToken
                            token.accessTokenExpires = user.accessTokenExpires
                            token.refreshToken = user.refreshToken
                            token.status = user.status
                            token.dateOfBirth = user.dateOfBirth

                        }
                        break;
                    case "google":
                        if (user) {

                            let [firstName, lastName] = user.name.split(" ")
                            token.firstName = firstName
                            token.lastName = lastName

                            let result = null
                            try {
                                result = await axios.get(AUTH_GOOGLE_LOGIN_URL(), {
                                    params: {
                                        access_token: account.access_token,
                                    },
                                })
                                console.log("AUTH-->", result.data)
                            } catch (error) {
                                console.log("AUTH.ERROR-->", error.response)
                            }

                            let data = result.data

                            user = await parseAccessToken(data)

                            token.id = user.id

                            if (user.firstName)
                                token.firstName = user.firstName || ""

                            if (user.lastName)
                                token.lastName = user.lastName || ""

                            if (user.picture && user.picture != "null")
                                token.picture = user.picture || ""

                            token.roleId = user.role?.id
                            token.roleName = user.role?.name
                            token.accessToken = user.accessToken
                            token.accessTokenExpires = user.accessTokenExpires
                            token.refreshToken = user.refreshToken
                            token.status = user.status
                            token.dateOfBirth = user.dateOfBirth

                        }
                        break;
                    case "line":

                        try {


                            if (user) {

                                console.log("--line.account--->", account)

                                let result = await axios.post(AUTH_LINE_LOGIN_URL(), {
                                    accessToken: account.access_token
                                })

                                let data = result.data

                                user = await parseAccessToken(data)

                                token.id = user.id

                                if (user.firstName)
                                    token.firstName = user.firstName || ""

                                if (user.lastName)
                                    token.lastName = user.lastName || ""

                                if (user.picture && user.picture != "null")
                                    token.picture = user.picture || ""

                                token.roleId = user.role.id
                                token.roleName = user.role.name
                                token.accessToken = user.accessToken
                                token.accessTokenExpires = user.accessTokenExpires
                                token.refreshToken = user.refreshToken
                                token.status = user.status
                                token.dateOfBirth = user.dateOfBirth
                                token.confirmed = user.confirmed
                                token.liff = true

                            }

                        } catch (error) {
                            console.log("--error--->", error)
                        }
                        break;

                    default:
                        if (user) {
                            token.id = user.id
                            token.firstName = user.firstName
                            token.lastName = user.lastName

                            if (user.picture && user.picture != "null")
                                token.picture = user.picture

                            // token.roleId = user.role.id
                            // token.roleName = user.role.name
                            token.accessToken = user.accessToken
                            token.accessTokenExpires = user.accessTokenExpires
                            token.refreshToken = user.refreshToken
                            token.status = user.confirmed
                            token.dateOfBirth = user.dateOfBirth
                            token.liff = user.liff
                        }
                        break;
                }
            }


            return token

            // if (Date.now() < token.accessTokenExpires) {
            //     return token
            // }

            // return null

            // return refreshAccessToken(token)
        },
        session: async ({ session, token, user }) => {
            if (token) session.id = token.id
            session.accessToken = token.accessToken;
            session.user = token
            return session;
        },
    },
    pages: {
        signIn: '/login',
        error: '/login',
        // signOut: '/signout',
        // error: '/error', // Error code passed in query string as ?error=
        // verifyRequest: '/verify-request', // (used for check email message)
        // newUser: '/signout'
    }
})