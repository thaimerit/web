export function liffAuthUtil(context, session) {

    // const config = await strapi.entityService.findMany('api::config.config', {
    // });

    // console.log({config})

    if (!session?.user) {

        // let line_liff_channel_id = ConfigService.get("LINE_LIFF_CHANNEL_ID")
        // return `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${line_liff_channel_id}&redirect_uri=${encodeURI(process.env.APP_URL + "/liff/auth/callback")}&state=liff&scope=profile%20openid`

        return {
            redirect: {
                permanent: false,
                destination: "/api/auth/liff"
            }
        }
    }

    return null
}