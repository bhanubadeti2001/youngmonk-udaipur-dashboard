/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#24364B',
          dark: '#1B2939',
          light: '#2E445E',
        },
        softgreen: {
          DEFAULT: '#79B85A',
          dark: '#66A04A',
          light: '#EAF4E6',
        },
        lightgrey: {
          DEFAULT: '#F3F5F7',
          dark: '#E2E6EA',
          border: '#E5E8EB',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
