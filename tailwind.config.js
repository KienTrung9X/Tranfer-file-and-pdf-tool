/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#137fec",
        "primary-hover": "#0f6bd0",
        "background-light": "#f6f7f8",
        "background-dark": "#101922",
        "surface-dark": "#1A2836",
        "border-dark": "#233648"
      },
      fontFamily: {
        display: ["Inter", "sans-serif"]
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/container-queries'),
  ],
  darkMode: 'class',
}
