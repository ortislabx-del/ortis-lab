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
        primary: {
          50: "#fef9f0",
          100: "#fef0d4",
          200: "#fddea8",
          300: "#fcc471",
          400: "#f9a03a",
          500: "#f78116",
          600: "#e8630c",
          700: "#c14a0c",
          800: "#9a3b11",
          900: "#7c3211",
          950: "#431706",
        },
      },
    },
  },
  plugins: [],
};
export default config;
