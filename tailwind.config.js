const colors = require('tailwindcss/colors')

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    colors: {
      transparent: 'transparent',
      current: 'currentColor',
      black: colors.black,
      white: colors.white,
      gray: colors.gray,
      emerald: colors.emerald,
      indigo: colors.indigo,
      yellow: colors.yellow,
      green: colors.green,
      primary: '#F68C29',
      danger: '#b91c1c'
    },
    extend: {
      colors: {
        'primary': '#F68C29',
        'danger': '#b91c1c',
      },
    },
  },
  plugins: [],
}
