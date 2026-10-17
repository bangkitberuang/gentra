/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gentra: {
          dark: '#0C4E34',
          hover: '#083B27',
          gold: '#F59E0B',
          amberHover: '#D97706',
          canvas: '#FBFBFA'
        }
      }
    },
  },
  plugins: [],
}
