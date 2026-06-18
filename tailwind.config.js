/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  // Градиенты карточек берутся из data.js динамически — защищаем их от очистки,
  // иначе карточки могут стать «белыми на белом».
  safelist: [
    {
      pattern:
        /(from|via|to)-(rose|orange|amber|pink|fuchsia|violet|purple|blue|indigo|sky|cyan|teal|emerald|green)-(400|500|600)/,
    },
  ],
  theme: {
    extend: {
      screens: {
        xs: '400px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Montserrat', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#fff1f2',
          100: '#ffe4e6',
          200: '#fecdd3',
          300: '#fda4af',
          400: '#fb7185',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
        },
      },
    },
  },
  plugins: [],
}
