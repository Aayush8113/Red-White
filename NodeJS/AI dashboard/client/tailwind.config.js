
export default {
  content: ["./index.html", "./src*.{js,ts,jsx,tsx}"],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          light: '#f8fafc', 
          dark: '#020617',  
        },
        surface: {
          light: '#ffffff',
          dark: '#0f172a',  
        },
        primary: "#6366f1",    
        accent: "#8b5cf6",     
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}