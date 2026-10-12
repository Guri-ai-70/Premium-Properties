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
      },
      boxShadow: {
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
