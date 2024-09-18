import { API } from "../service/apiService"

export async function checkUserActive(context, session) {
    // if (session?.user?.status?.id == 2) {
    //     return {
    //         redirect: {
    //             permanent: false,
    //             destination: "/signup-confirm"
    //         }
    //     }
    // }

    if (session) {
        if (session.user?.liff == true) {
            if (context.resolvedUrl != "/profile") {
                return {
                    redirect: {
                        permanent: false,
                        destination: "/liff/orders"
                    }
                }
            }
        }
    }

    return null
}

export async function checkUserLiffActive(context, session) {
    
    if (session) {
        API.init(session)

        console.log("checkUserLiffActive.session", session)
       
        if (session.user?.liff == true) {

            try {
                if (session) {
                    let user = await API.liffProfile()

                    if (user == false) {
                        return {
                            redirect: {
                                permanent: false,
                                destination: "/liff/no-auth"
                            }
                        }
                    }
                }
            } catch (error) {
                console.error({ errorData: error.response.data })
                if(error?.response?.data?.error?.status == 401){
                    return {
                        redirect: {
                            permanent: false,
                            destination: "/liff/no-auth-clear"
                        }
                    }
                }
                return {
                    redirect: {
                        permanent: false,
                        destination: "/liff/no-auth"
                    }
                }
            }

            if (context.resolvedUrl != "/profile" && context.resolvedUrl.substring(0, 5) != "/liff") {
                return {
                    redirect: {
                        permanent: false,
                        destination: "/liff/orders"
                    }
                }
            }

            return null
        } else {
            // return {
            //     redirect: {
            //         permanent: false,
            //         destination: "/"
            //     }
            // }
        }
    }

    return null
}