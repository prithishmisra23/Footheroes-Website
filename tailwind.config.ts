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
        background: "#F7F4EE",
        surface: "#FFFFFF",
        card: "#FFFFFF",
        primary: {
          DEFAULT: "#F75A0A",
          dark: "#D94801",
        },
        accent: "#FFD166",
        secondary: "#171717",
        danger: "#EF4444",
        warning: "#F97316",
        text: {
          DEFAULT: "#171717",
          muted: "#6B6962",
        },
        border: "#DEDAD2",
      },
      fontFamily: {
        bebas: ["var(--font-bebas-neue)", "sans-serif"],
        exo: ["var(--font-exo-2)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        mono: ["var(--font-jetbrains-mono)", "monospace"],
      },
      backgroundImage: {
        "pitch-pattern": "linear-gradient(rgba(148,163,184,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.08) 1px, transparent 1px)",
      },
      boxShadow: {
        card: "0 22px 44px -24px rgba(8, 17, 31, 0.9), 0 10px 18px -10px rgba(8, 17, 31, 0.65)",
      },
    },
  },
  plugins: [],
};
export default config;
