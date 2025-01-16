import defaultTheme from 'tailwindcss/defaultTheme'
import { Config } from 'tailwindcss'
export default {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Carbona', ...defaultTheme.fontFamily.serif],
      },
      colors: {
        niagara: {
          50: '#f1fcf9',
          100: '#d0f7ee',
          200: '#a1eedd',
          300: '#6adec9',
          400: '#3bc6b2',
          500: '#22aa98',
          600: '#1b998b',
          700: '#186d65',
          800: '#175852',
          900: '#184945',
          950: '#082b2a',
        },

        crimson: {
          50: '#fef2f2',
          100: '#fee6e5',
          200: '#fccfd0',
          300: '#f9a8a8',
          400: '#f5777b',
          500: '#ec4751',
          600: '#d72638',
          700: '#b61a2e',
          800: '#98192d',
          900: '#83182c',
          950: '#490812',
        },
      },
    },
  },
}
