/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        borderGray: "#D1D8DB",
        buttonGray: "#F1F3F5",
        buttonBlack: "#283237",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontSize: {
        "5xl": "2.5rem",
      },
      backgroundSize: {
        25: "25%",
        50: "50%",
      },
      keyframes: {
        reduce: {
          "0%": { transform: "scale(2.1)" },
          "50%": { transform: "scale(1)" },
          "100%": { transform: "scale(2.1)" },
        },
        "reduce-mobile": {
          "0%": { transform: "scale(1.2)" },
          "50%": { transform: "scale(0.7)" },
          "100%": { transform: "scale(1.2)" },
        },
        "spin-slow": {
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "slow-spin": "spin-slow 7s linear infinite",
        reduce: "reduce 7s ease-in-out infinite",
        "reduce-mobile": "reduce-mobile 7s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
