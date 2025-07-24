/** @type {import('tailwindcss').Config} */
import gluestackPlugin from '@gluestack-ui/nativewind-utils/tailwind-plugin';

module.exports = {
  darkMode: 'class',
  content: ['app/**/*.{tsx,jsx,ts,js}', 'components/**/*.{tsx,jsx,ts,js}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#3F51B5',
          light: '#5C6BC0',
        },
        secondary: {
          DEFAULT: '#FF6B6B',
        },
        success: {
          DEFAULT: '#A5D8FF',
        },
        background: {
          DEFAULT: '#F7F9FB',
        },
        text: {
          DEFAULT: '#1C1C1E',
          muted: '#8E9EAB',
        },
        black: '#121212',
      },
      fontFamily: {
        ibmpRegular: 'IBMPRegular',
        ibmpBold: 'IBMPLexSansThaiLooped-Bold',
        heading: ['DanaBold'],
        danaMedium: ['DanaMedium'],
        danaRegular: ['DanaRegular'],
      },
      fontSize: {
        '2xs': '0.625rem',
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
        '3xl': '1.875rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        card: '0px 2px 10px rgba(38, 38, 38, 0.1)',
        button: '0px 3px 10px rgba(38, 38, 38, 0.2)',
      },
      borderRadius: {
        lg: '15px',
        xl: '1rem',
        '2xl': '1.5rem',
      },
    },
  },
  plugins: [gluestackPlugin],
};
