/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0F4C5C',
        accent: '#F4A261',
        'accent-light': '#E9C46A',
        'gold-400': '#F4A261',
        'gold-500': '#E9C46A',
        'amber-400': '#FFC107',
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}

