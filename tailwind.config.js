/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#1261A0',
        cleanGreen: '#2E9B5B',
        saffron: '#F28C28',
        earthBrown: '#8B5E3C',
        cream: '#FFF8ED',
        darkText: '#17212B',
        mutedText: '#667085',
        dangerRed: '#D64545',
      },
    },
  },
  plugins: [],
};
