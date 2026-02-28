import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "milky-blue": "rgb(176, 217, 245)",
        "soft-white": "#eef4fa",
        "sunny-yellow": "#FEF9C3",
        "sakura-pink": "#FCE7F3",
        "charcoal-gray": "#798493",
      },
      borderRadius: {
        "xl-plus": "2rem",
      },
    },
  },
  plugins: [],
};
export default config;
