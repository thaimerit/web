/** @type {import('next').NextConfig} */
const nextConfig = {
  optimizeFonts: false,
  reactStrictMode: false,
  env: {
    API_URL: 'https://admin-thai-merit.extics.com/api',
    ASSET_URL: 'https://admin-thai-merit.extics.com',
    CSRF_SECRET: 'ThaImErIt2022',
    BASE_URL: 'http://localhost:3000',
    APP_ANDROID_URL:"https://play.google.com/store/apps/details?id=app.thaimerit.com",
    APP_IOS_URL:"https://apps.apple.com/th/app/thaimerit/id1644133483",

  },
  i18n: {
    locales: ['th'],
    defaultLocale: 'th',
  },
}

module.exports = nextConfig
