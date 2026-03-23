/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        deep: '#4f46e5',
        passive: '#f43f5e',
        fragmented: '#f59e0b',
        neutral: '#64748b',
      },
    },
  },
  plugins: [],
}
