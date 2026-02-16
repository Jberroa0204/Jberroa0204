import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#F5F8FA",
        foreground: "#00213E",
        card: "#FFFFFF",
        border: "#D9E2EC",
        muted: "#EEF3F7",
        primary: "#00D9C9",
        "primary-ink": "#0A2540",
        warning: "#FFC857",
        destructive: "#C0362C",
        success: "#0E7A6D"
      },
      boxShadow: {
        soft: "0 6px 22px rgba(10, 37, 64, 0.08)"
      },
      keyframes: {
        grow: {
          from: { width: "0%" },
          to: { width: "var(--progress-width)" }
        }
      },
      animation: {
        grow: "grow 350ms ease-out"
      }
    }
  },
  plugins: []
};

export default config;
