/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        arabic: ['IBM Plex Sans Arabic', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        tg: {
          bg: '#17212b',
          chat: '#0e1621',
          bubble: '#182533',
          bubbleOut: '#2b5278',
          accent: '#5288c1',
          accentLight: '#64b5f6',
          text: '#e8e8e8',
          subtext: '#7d8b94',
          green: '#4caf50',
          red: '#f44336',
          yellow: '#ffc107',
          orange: '#ff9800',
          button: '#2b5278',
          buttonHover: '#3a6999',
          header: '#1c2b3a',
          divider: '#242f3d',
          gold: '#ffd700',
          diamond: '#b9f2ff',
        }
      },
      animation: {
        'typing': 'typing 1.4s infinite',
        'fadein': 'fadein 0.3s ease-in',
        'slideup': 'slideup 0.3s ease-out',
        'pulse-slow': 'pulse 2s infinite',
      },
      keyframes: {
        typing: {
          '0%, 60%, 100%': { transform: 'translateY(0)' },
          '30%': { transform: 'translateY(-6px)' },
        },
        fadein: {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        slideup: {
          from: { transform: 'translateY(10px)', opacity: '0' },
          to: { transform: 'translateY(0)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
