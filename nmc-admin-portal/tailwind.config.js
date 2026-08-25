const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
  ],

  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#8A0000",
          light: "#B00000",
          dark: "#6B0000",
          50: "#fff5f5",
          100: "#ffe3e3",
          500: "#8A0000",
          600: "#7a0000",
          700: "#6B0000",
        },
        gold: {
          DEFAULT: "#F4B000",
          light: "#F59E0B",
          dark: "#D97706",
          50: "#fffbeb",
          100: "#fef3c7",
          500: "#F4B000",
          600: "#d97706",
        },
      },
      fontFamily: {
        sans: ["Open Sans", ...defaultTheme.fontFamily.sans],
        serif: ["Inter", ...defaultTheme.fontFamily.serif],
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
    },
  },

  plugins: [
    require("@tailwindcss/forms"),
  ],
};
