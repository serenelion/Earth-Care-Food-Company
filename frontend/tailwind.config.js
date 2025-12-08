/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        serif: ['Merriweather', 'serif'],
      },
      colors: {
        earth: {
          50: '#f4f7f4',
          100: '#e3ebe3',
          200: '#c5d8c5',
          300: '#9aba9a',
          400: '#6b9c6b',
          500: '#4a824a',
          600: '#386638',
          700: '#2f522f',
          800: '#284228',
          900: '#213621',
        },
        cream: {
          50: '#fdfbf7',
          100: '#fcf7ed',
          200: '#f8ebd4',
          300: '#f2daaf',
          400: '#ecbd80',
          500: '#e59f56',
          600: '#d98236',
          700: '#b4662c',
          800: '#92522a',
          900: '#784426',
        }
      }
    }
  },
  plugins: [],
}
