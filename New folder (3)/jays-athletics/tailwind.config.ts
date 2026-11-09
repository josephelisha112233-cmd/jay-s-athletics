import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: {
      white: { DEFAULT: "#FFFFFF", ivory: "#FFFFF0", off: "#FAF9F6", pearl: "#F5F3EE", mist: "#EDEBE6" },
      gold: { DEFAULT: "#D4AF37", deep: "#B8860B", light: "#F1E5AC" },
      ink: "#1F1F1F",
    },
    fontFamily: { sans: ["var(--font-body)", "sans-serif"], display: ["var(--font-display)", "sans-serif"] },
    boxShadow: { soft: "0 4px 20px rgba(184,134,11,0.12)" },
  } },
  plugins: [],
};
export default config;
