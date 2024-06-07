import type { Config } from "tailwindcss";

export default {
  content: ["./app/**/*.{js,jsx,ts,tsx}"],
  // darkMode: "selector",
  theme: {
    extend: {
      colors: {
        brand: {
          100: "var(--brand-100)",
          500: "var(--brand-500)",
          600: "var(--brand-600)",
        },
        foreground: {
          DEFAULT: "var(--foreground)",
          one: "var(--foreground-one)",
          two: "var(--foreground-two)",
        },
        border: {
          DEFAULT: "var(--border)",
          hover: "var(--border-hover)",
        },
        background: {
          DEFAULT: "var(--background)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
