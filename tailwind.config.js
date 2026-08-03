/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      colors: {
        primary: {
          50: "#eff6ff",
          100: "#dbeafe",
          200: "#bfdbfe",
          500: "#3b82f6",
          600: "#2563eb",
          700: "#1d4ed8",
          900: "#0c2f63",
          DEFAULT: "#2563eb",
          dark: "#0c2f63",
        },
        ink: "#0f172a",
        muted: "#64748b",
        surface: "#ffffff",
        "surface-alt": "#f8fafc",
        "accent-gold": {
          DEFAULT: "#f59e0b",
          light: "#eab308",
        },
      },
      boxShadow: {
        card: "0 1px 3px 0 rgba(15, 23, 42, 0.08), 0 1px 2px -1px rgba(15, 23, 42, 0.06)",
        "card-hover":
          "0 10px 25px -5px rgba(15, 23, 42, 0.15), 0 8px 10px -6px rgba(15, 23, 42, 0.1)",
      },
    },
  },
  plugins: [],
};
