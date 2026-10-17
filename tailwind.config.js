/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Instrument Serif"', 'Georgia', 'Cambria', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      colors: {
        gentra: {
          dark: '#0C4E34',
          pine: '#071A12',
          forest: '#0B291D',
          hover: '#083B27',
          gold: '#F59E0B',
          amberHover: '#D97706',
          canvas: '#FAF8F5',
          paper: '#F5F1EB',
          basalt: '#070B09',
        }
      }
    },
  },
  plugins: [],
}
