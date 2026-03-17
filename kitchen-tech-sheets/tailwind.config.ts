import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        kitchen: {
          50: "#fdf4e7",
          100: "#fce4c4",
          200: "#f9c97f",
          300: "#f6ad3a",
          400: "#f09610",
          500: "#e07c00",
          600: "#b85f00",
          700: "#8a4500",
          800: "#5c2e00",
          900: "#2e1700",
        },
      },
    },
  },
  plugins: [],
};

export default config;
