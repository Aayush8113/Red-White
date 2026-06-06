/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f8fafc', // slate 50
          dark: '#020617',  // slate 950
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',  // slate 900
        },
        primary: "#6366f1",    // Indigo 500
        accent: "#8b5cf6",     // Violet 500
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}