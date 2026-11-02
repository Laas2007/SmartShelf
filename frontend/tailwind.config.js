/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#eef6ff',
          100: '#d9eaff',
          200: '#bcd9ff',
          300: '#8ec2ff',
          400: '#599eff',
          500: '#2f7bff',
          600: '#195bec',
          700: '#1446d4',
          800: '#1739ab',
          900: '#193486',
        }
      }
    },
  },
  plugins: [],
}
