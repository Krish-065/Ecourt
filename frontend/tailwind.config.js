/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        legal: {
          50: '#f4f6fb',
          100: '#e6ebf5',
          200: '#cedaf0',
          300: '#a5bee3',
          400: '#749bd4',
          500: '#4f7bc5',
          600: '#3c60b0',
          700: '#314d91',
          800: '#2d4277',
          900: '#293960',
          950: '#0b1120',
        },
        gold: {
          400: '#f59e0b',
          500: '#d97706',
          600: '#b45309',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
