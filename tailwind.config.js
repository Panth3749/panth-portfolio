/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
        display: ['"Outfit"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
        kraton: ['"Kraton"', 'Georgia', 'serif'],
      },
      colors: {
        background: '#FAF7F2',
        surface: '#FFFFFF',
        surfaceWarm: '#F5EFE6',
        surfaceLight: '#F0F6FD',
        theme: {
          beige: '#F5EFE6',
          beigeDark: '#EDE5D8',
          warmWhite: '#FAF7F2',
          pureWhite: '#FFFFFF',
          sky: '#38BDF8',
          skyLight: '#BAE6FD',
          skySubtle: '#E0F2FE',
          lightBlue: '#93C5FD',
          blue: '#2563EB',
          blueDark: '#1D4ED8',
        }
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
