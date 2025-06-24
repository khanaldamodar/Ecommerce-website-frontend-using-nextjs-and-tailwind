import type { Config } from 'tailwindcss'

const config: Config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-poppins)'], // sets as default `font-sans`
        poppins: ['var(--font-poppins)'], // allows you to use `font-poppins` too
      },
      
    },
  },
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
  ],
  plugins: [],
}

export default config
