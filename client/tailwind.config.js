/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bit: {
          50: '#F0F5FF',
          100: '#E0EAFF',
          200: '#C7D7FE',
          300: '#A4BCFD',
          400: '#7997F9',
          500: '#4D6EF5',
          600: '#2547EB',
          700: '#1D35D8',
          800: '#1B2BAE',
          900: '#0F172A',
          navy: '#0B192C',
          royal: '#1E3E62',
          gold: '#FFB800',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
