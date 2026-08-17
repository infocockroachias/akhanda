/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'playfair': ['Playfair Display', 'Georgia', 'serif'],
        'inter': ['Inter', 'Noto Sans', 'system-ui', 'sans-serif'],
      },
      colors: {
        'mughal': '#8B4513',
        'maratha': '#FF9933',
        'rajput': '#C8102E',
        'sikh': '#0066CC',
        'mysore': '#4B0082',
        'british': '#1C1C1C',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        timeWarpMap: {
          '0%': { filter: 'blur(0) saturate(1)', opacity: '1', transform: 'scale(1) rotate(0)' },
          '50%': { filter: 'blur(3.5px) saturate(0.3)', opacity: '0.75', transform: 'scale(1.02)' },
          '100%': { filter: 'blur(0) saturate(1)', opacity: '1', transform: 'scale(1) rotate(0)' },
        },
        warpFlash: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0.3' },
          '100%': { opacity: '0' },
        },
        warpRing: {
          '0%': { transform: 'translate(-50%,-50%) scale(0.15)', opacity: '0' },
          '50%': { opacity: '0.5' },
          '100%': { transform: 'translate(-50%,-50%) scale(1)', opacity: '0' },
        },
        warpLabel: {
          '0%': { opacity: '0', transform: 'translate(-50%,-50%) scale(0.9)' },
          '20%': { opacity: '1', transform: 'translate(-50%,-50%) scale(1.1)' },
          '80%': { opacity: '1', transform: 'translate(-50%,-50%) scale(1)' },
          '100%': { opacity: '0', transform: 'translate(-50%,-50%) scale(0.9)' },
        },
      },
    },
  },
  plugins: [],
}
