/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        nile: {
          950: '#070B14',
          900: '#0B0F19',
          850: '#0F1626',
          800: '#141D32',
          700: '#1E293B',
          accent: '#00E599',
          cyan: '#06B6D4',
          emerald: '#10B981',
          gold: '#F59E0B'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        farsi: ['Vazirmatn', 'Tahoma', 'sans-serif']
      }
    },
  },
  plugins: [],
}
