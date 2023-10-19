/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        'BubblegumSans': ['Bubblegum Sans', 'cursive'],
        'Nunito': ['Nunito', 'sans-serif'],
        'OpenSans': ['Open Sans', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
