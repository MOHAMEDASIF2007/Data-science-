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
          mainBg: '#07111F',
          secondaryBg: '#0B1727',
          card: '#101D2D',
          elevated: '#142338',
          border: '#24344A',
          amberMain: '#E8B56A',
          amberLight: '#F2C982',
          amberDark: '#D99A4A',
          amberDeep: '#B97932',
          coralMain: '#F07C73',
          coralLight: '#FFB0A8',
          purpleMain: '#A78BFA',
          purpleLight: '#C4B5FD',
          cyanMain: '#38BDF8',
          cyanLight: '#67E8F9',
          explainAmberMain: '#F59E0B',
          explainAmberLight: '#FDBA74',
          explainAmberDark: '#EA9A2B',
          violetMain: '#C084FC',
          violetLight: '#DDD6FE',
          textMain: '#F4F7FA',
          textSecondary: '#9AA9BA',
          textMuted: '#68788C'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}
