/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Heebo carries both Hebrew and Latin, so one face sets all body text.
        sans: ["Heebo", "Arial", "sans-serif"],
        // Editorial headline face; has Hebrew and Latin glyphs.
        display: ["'Frank Ruhl Libre'", "Georgia", "serif"],
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
        // Warm near-black: text, dark grounds, primary actions.
        ink: {
          DEFAULT: "#1b1916",
          soft: "#2b2824",
        },
        // Limestone neutrals, the page ground and quiet text.
        stone: {
          50: "#f9f7f3",
          100: "#f3efe8",
          200: "#e6dfd3",
          300: "#d3c8b7",
          400: "#a99e8f",
          500: "#857a6c",
          600: "#6b6257",
          700: "#4f483f",
        },
        // The single accent. `dark` is the text-safe step (≥4.5:1 on stone-100).
        brass: {
          light: "#c9a66b",
          DEFAULT: "#9a7440",
          dark: "#7a5a2b",
        },
        // Second status colour (rentals): deep olive, 7:1 with white text.
        olive: {
          light: "#a3b59a",
          DEFAULT: "#3d5a47",
        },
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
        panel: "0 18px 40px -12px rgba(27, 25, 22, 0.45)",
      },
      keyframes: {
        settle: {
          from: { transform: "scale(1.06)" },
          to: { transform: "scale(1)" },
        },
      },
      animation: {
        settle: "settle 1.6s cubic-bezier(0.16, 1, 0.3, 1) both",
      },
    },
  },
  plugins: [],
};
