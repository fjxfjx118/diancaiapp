/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  theme: {
    extend: {
      colors: {
        'peach': {
          DEFAULT: '#FFD1D1',
          light: '#FFE8E8',
          dark: '#FFB3B3',
        }
      }
    },
  },
  plugins: [],
}

