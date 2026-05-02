/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#e50914",
        secondary: "#221f1f",
        dark: "#0a0a0a",
        accent: "#f5f5f1"
      }
    },
  },
  plugins: [],
}
