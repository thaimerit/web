export function API_URL(url) {
    return process.env.API_URL + url
}

export function AUTH_EMAIL_LOGIN_URL(option = {}) {
    return API_URL("/auth/local")
}

export function USER_ME_URL(option = {}) {
    return API_URL("/users/me")
}

export function LIFF_PROFILE(option = {}) {
    return API_URL("/liff/profile")
}

export function AUTH_FACEBOOK_LOGIN_URL(option = {}) {
    return API_URL("/auth/facebook/callback")
}

export function AUTH_GOOGLE_LOGIN_URL(option = {}) {
    return API_URL("/auth/google/callback")
}

export function AUTH_LINE_LOGIN_URL(option = {}) {
    return API_URL("/liff/auth")
}

export function AUTH_REFRESH_URL(option = {}) {
    return API_URL("/auth/refresh")
}

export function AUTH_EMAIL_REGISTER_URL(option = {}) {
    return API_URL("/auth/email/register")
}

export function GET_PLACES(option = {}) {
    return API_URL("/places")
}

export function GET_PRODUCTS(option = {}) {
    return API_URL("/products")
}