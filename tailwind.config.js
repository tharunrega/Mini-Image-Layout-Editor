/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 10px 20px rgba(0,0,0,0.05), 0 2px 6px rgba(0,0,0,0.04)"
      },
      borderRadius: {
        '2xl': '1.25rem'
      }
    },
  },
  plugins: [],
};
