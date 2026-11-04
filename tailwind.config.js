/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      colors: {
        emerald: {
          400: '#34d399',
          500: '#10b981',
          mist: '#059669',
        },
        slate: {
          850: '#0f172a',
          900: '#0b0f19',
          950: '#05070e',
        },
      },
    },
  },
  plugins: [],
};

