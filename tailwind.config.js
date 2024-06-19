/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    'node_modules/flowbite-react/lib/esm/**/*.js'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          'light':"#69c0bd",
          'dark': "#21827f"
        }
      },
      backgroundImage:{
        'hero-bg': "url('./src/resources/background.jpg')"
      }
    },
  },
  plugins: ['flowbite/plugin'],
}
