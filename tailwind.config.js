/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        sand: {
          50: '#faf7f2',
          100: '#f3ece1',
          200: '#e7d9c4',
          300: '#d6c1a1',
          400: '#c2a37a',
          500: '#ad8757',
          600: '#8f6a42',
          700: '#6f4f33',
          800: '#4d3724',
          900: '#2c2015',
        },
        ink: {
          50: '#f6f6f5',
          100: '#e7e6e3',
          200: '#cfcdc8',
          300: '#a8a59e',
          400: '#79766d',
          500: '#575550',
          600: '#3e3c39',
          700: '#2b2a28',
          800: '#1c1b1a',
          900: '#100f0f',
        },
        clay: {
          400: '#d98a6f',
          500: '#c66a4d',
          600: '#a44e35',
        },
        moss: {
          500: '#5a7a4f',
          600: '#456039',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      maxWidth: {
        content: '1280px',
      },
      boxShadow: {
        soft: '0 2px 12px -2px rgba(16,15,15,0.08), 0 8px 32px -12px rgba(16,15,15,0.12)',
        lift: '0 12px 40px -12px rgba(16,15,15,0.25)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
        'fade-in': 'fade-in 0.5s ease-out both',
        'scale-in': 'scale-in 0.25s ease-out both',
        marquee: 'marquee 32s linear infinite',
      },
    },
  },
  plugins: [],
};
