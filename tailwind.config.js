import defaultTheme from 'tailwindcss/defaultTheme'
import { Config } from 'tailwindcss'
export default {
  theme: {
    extend: {
      fontFamily: {
        // Shared with the locally hosted font faces.
        sans: ['var(--font-body)', 'DM Sans', ...defaultTheme.fontFamily.sans],
        mono: ['JetBrains Mono', ...defaultTheme.fontFamily.mono],
      },
      maxWidth: {
        'site': '1100px',
      },
      colors: {
        // TWEAK PANEL: sky/blue resolve through CSS vars so the panel can retheme live.
        // When a color is chosen, revert these to static Tailwind palettes and delete the panel.
        sky: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
          950: 'rgb(var(--primary-950) / <alpha-value>)',
        },
        blue: {
          50: 'rgb(var(--primary-50) / <alpha-value>)',
          100: 'rgb(var(--primary-100) / <alpha-value>)',
          200: 'rgb(var(--primary-200) / <alpha-value>)',
          300: 'rgb(var(--primary-300) / <alpha-value>)',
          400: 'rgb(var(--primary-400) / <alpha-value>)',
          500: 'rgb(var(--primary-500) / <alpha-value>)',
          600: 'rgb(var(--primary-600) / <alpha-value>)',
          700: 'rgb(var(--primary-700) / <alpha-value>)',
          800: 'rgb(var(--primary-800) / <alpha-value>)',
          900: 'rgb(var(--primary-900) / <alpha-value>)',
          950: 'rgb(var(--primary-950) / <alpha-value>)',
        },
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
