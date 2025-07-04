/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'serif': ['Playfair Display', 'serif'],
        'sans': ['Inter', 'sans-serif'],
      },
      colors: {
        champagne: {
          50: '#fefdfb',
          100: '#fdf9f0',
          200: '#f9f0e1',
          300: '#f4e4c1',
          400: '#ecd19c',
          500: '#e2b875',
          600: '#d4a574',
          700: '#c4956b',
          800: '#b08660',
          900: '#8f6f4f',
        },
        charcoal: {
          50: '#f6f6f6',
          100: '#e7e7e7',
          200: '#d1d1d1',
          300: '#b0b0b0',
          400: '#888888',
          500: '#6d6d6d',
          600: '#5d5d5d',
          700: '#4f4f4f',
          800: '#454545',
          900: '#3d3d3d',
        },
        ivory: {
          50: '#fefefe',
          100: '#fefefe',
          200: '#fefcfc',
          300: '#fdf8f8',
          400: '#fbf1f1',
          500: '#f7e8e8',
          600: '#f0d6d6',
          700: '#e6c0c0',
          800: '#d9a6a6',
          900: '#c88888',
        },
        navy: {
          50: '#f0f4f8',
          100: '#d9e2ec',
          200: '#bcccdc',
          300: '#9fb3c8',
          400: '#829ab1',
          500: '#627d98',
          600: '#486581',
          700: '#334e68',
          800: '#243b53',
          900: '#102a43',
        },
        gold: {
          50: '#fefcf0',
          100: '#fef7d7',
          200: '#fdeeb0',
          300: '#fbe087',
          400: '#f7cc56',
          500: '#f1b434',
          600: '#e09818',
          700: '#c07c15',
          800: '#9c6317',
          900: '#7f5218',
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.6s ease-out',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
};