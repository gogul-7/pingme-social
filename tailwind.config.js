/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "theme-primary": "var(--theme-color-primary)",
        "theme-primary-lightened": "var(--theme-color-primary-lightened)",
      },
    },
  },
  plugins: [],
};
