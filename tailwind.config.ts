import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Couleurs principales Africréa
        africrea: {
          green: {
            50: '#e8f7ed',
            100: '#c5ebd3',
            200: '#9edeb6',
            300: '#77d199',
            400: '#4ec47c',
            500: '#27ad65', // Couleur principale
            600: '#1f8a51',
            700: '#17673d',
            800: '#0f4529',
            900: '#082214',
          },
          gold: {
            50: '#fef9e6',
            100: '#fef0bf',
            200: '#fde793',
            300: '#fcde67',
            400: '#fbd53b',
            500: '#facc17', // Couleur secondaire
            600: '#c8a312',
            700: '#967a0e',
            800: '#645209',
            900: '#322905',
          },
        },
      },
      fontFamily: {
        display: ['var(--font-display)', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-africrea': 'linear-gradient(135deg, #27ad65 0%, #1f8a51 50%, #17673d 100%)',
        'gradient-gold': 'linear-gradient(135deg, #facc17 0%, #c8a312 100%)',
        'gradient-dark': 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 50%, #16213e 100%)',
        'pattern-dots': 'radial-gradient(circle, #27ad65 1px, transparent 1px)',
        'pattern-grid': 'linear-gradient(to right, #27ad6510 1px, transparent 1px), linear-gradient(to bottom, #27ad6510 1px, transparent 1px)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
export default config

