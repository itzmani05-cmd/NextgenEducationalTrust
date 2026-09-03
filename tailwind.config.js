/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      screens: {
        '3xl': '1920px',
        '4xl': '2560px',
        '5xl': '3200px',
        '6xl': '3840px',
        '7xl': '4480px',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['"DM Serif Display"', 'ui-serif', 'Georgia', 'serif'],
      },
      colors: {
        brand: {
          surface: '#F4F7FC',
          border: '#E3E9F2',
          text: '#17233C',
          muted: '#5B6780',
          navy: '#173F8A',
          red: '#C8102E',
          redDark: '#A80D26',
          amber: '#F5A623',
          ink: '#0F1A2B',
          rust: '#B45309',
          rustDark: '#8A4108',
          cream: '#F7F5F1',
        },
      },
    },
  },
  plugins: [],
}
