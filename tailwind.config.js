/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: '#101820',
        paper: '#f6f0e6',
        grape: '#3FA9F5',
      },
      fontFamily: {
        display: ['"Futura Bold"', 'Outfit', 'sans-serif'],
        sans: ['Outfit', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
