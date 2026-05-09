import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        ink: {
          975: "#03050d",
          950: "#060814",
          900: "#0a0e1c",
          850: "#0e1326",
          800: "#131930",
          700: "#1a2240",
          600: "#232c50",
          500: "#2f3a65",
        },
        argus: {
          50: "#eef2ff",
          100: "#d9e1ff",
          200: "#b3c2ff",
          300: "#8ea4ff",
          400: "#6b86ff",
          500: "#2d5bff",
          600: "#1a47e5",
          700: "#0a35b8",
          800: "#0a2b8f",
          900: "#0e2370",
        },
        meadow: {
          300: "#7dce9e",
          400: "#5bb57b",
          500: "#3d9e68",
          600: "#2e6b47",
          700: "#234f35",
        },
        energy: {
          300: "#ffa76a",
          400: "#ff8c45",
          500: "#ff7a30",
          600: "#e55f1a",
        },
        pop: {
          300: "#ff80c8",
          400: "#ff66bd",
          500: "#ff4fb5",
          600: "#e5339a",
        },
        clay: {
          300: "#d4b89a",
          400: "#c4a584",
          500: "#b68868",
          600: "#946a4d",
        },
        amber: {
          300: "#ffa76a",
          400: "#ff8c45",
          500: "#ff7a30",
        },
        crimson: {
          400: "#ff5c7a",
          500: "#ff2e5b",
        },
        plum: {
          500: "#ff4fb5",
          600: "#e5339a",
        },
        signal: {
          amber: "#ff7a30",
          red: "#ff2e5b",
          blue: "#8ea4ff",
          violet: "#ff4fb5",
        },
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.05)" },
        },
        "scan": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
        "blink": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        "fade-up": {
          from: { opacity: "0", transform: "translateY(12px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "drift-a": {
          "0%, 100%": { transform: "translate3d(-8%, -4%, 0) scale(1)" },
          "33%": { transform: "translate3d(12%, 6%, 0) scale(1.08)" },
          "66%": { transform: "translate3d(-4%, 10%, 0) scale(0.95)" },
        },
        "drift-b": {
          "0%, 100%": { transform: "translate3d(6%, 8%, 0) scale(1)" },
          "50%": { transform: "translate3d(-10%, -6%, 0) scale(1.1)" },
        },
        "drift-c": {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)" },
          "50%": { transform: "translate3d(8%, -8%, 0) scale(0.92)" },
        },
        "trace": {
          "0%": { strokeDashoffset: "1000" },
          "100%": { strokeDashoffset: "0" },
        },
        "tick": {
          "0%, 90%, 100%": { opacity: "0.3" },
          "45%": { opacity: "1" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2.4s ease-in-out infinite",
        "scan": "scan 3s ease-in-out infinite",
        "blink": "blink 1s step-end infinite",
        "fade-up": "fade-up 0.6s ease-out forwards",
        "drift-a": "drift-a 28s ease-in-out infinite",
        "drift-b": "drift-b 34s ease-in-out infinite",
        "drift-c": "drift-c 40s ease-in-out infinite",
        "trace": "trace 6s ease-in-out infinite",
        "tick": "tick 3s ease-in-out infinite",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
} satisfies Config;
