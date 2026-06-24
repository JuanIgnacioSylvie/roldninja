import type { Config } from "tailwindcss";

export default {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        /** Legacy aliases remapped to Railway-like palette */
        parchment: "#e4e4e7",
        ink: "#0a0a0a",
        blood: "#ef4444",
        gold: "#853bce",
        "gold-light": "#a855f7",
        arcane: "#853bce",
        panel: "#131517",
        panel2: "#1a1a1d",
        /** Railway-style tokens */
        surface: "#131517",
        surface2: "#1a1a1d",
        surface3: "#232326",
        muted: "#a1a1aa",
        brand: "#853bce",
        "brand-light": "#a855f7",
      },
      fontFamily: {
        hero: ["var(--font-hero)", "serif"],
        display: ["var(--font-body)", "serif"],
        body: ["var(--font-body)", "serif"],
      },
      boxShadow: {
        glow: "0 0 80px -20px rgba(133, 59, 206, 0.35)",
        card: "0 1px 0 0 rgba(255,255,255,0.05) inset",
      },
    },
  },
  plugins: [],
} satisfies Config;
