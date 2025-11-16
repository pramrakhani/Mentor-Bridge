/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f4ff',
          100: '#e0e9ff',
          500: '#6C63FF',
          600: '#5a52e6',
          700: '#4a42cc',
        },
        secondary: {
          400: '#FFB84D',
          500: '#FF9F89',
        },
        neutral: {
          50: '#F7F9FC',
          100: '#E8EBF0',
          800: '#2C3E50',
        },
        success: {
          500: '#4CAF50',
        },
      },
      fontFamily: {
        sans: ['Inter', 'Poppins', 'Open Sans', 'Roboto', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

