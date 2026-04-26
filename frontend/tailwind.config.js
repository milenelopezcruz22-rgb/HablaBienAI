/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0f172a",
        foreground: "#f8fafc",
        primary: "#4f46e5",
        secondary: "#10b981",
        card: "#1e293b",
        border: "#334155",
      },
    },
  },
  plugins: [],
};