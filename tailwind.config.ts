import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "#f8fafc",
        foreground: "#0f172a",
        card: "#ffffff",
        border: "#e2e8f0",
        muted: "#f1f5f9",
        primary: "#1d4ed8",
        secondary: "#334155",
        destructive: "#b91c1c"
      },
      boxShadow: {
        soft: "0 4px 20px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
