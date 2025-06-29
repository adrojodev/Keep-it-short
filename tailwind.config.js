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
        "top-idle": {
          "25%": {
            opacity: "75%",
            transform: "scale(0.75) translate(-20%, 20%)",
          },
          "50%": {
            opacity: "100%",
            transform: "scale(1.25) translate(-20%, -20%)",
          },
          "75%": {
            opacity: "75%",
            transform: "scale(0.75) translate(20%, -20%)",
          },
        },
        "bottom-idle": {
          "25%": {
            opacity: "50%",
            transform: "scale(1.25) translate(20%, -20%)",
          },
          "50%": {
            opacity: "100%",
            transform: "scale(0.75) translate(20%, 20%)",
          },
          "75%": {
            opacity: "50%",
            transform: "scale(1.25) translate(-20%, 20%)",
          },
        },
        "spin-slow": {
          "100%": {
            transform: "rotate(360deg)",
          },
        },
      },
      animation: {
        "background-top-idle": "top-idle 7s ease-in-out infinite",
        "background-bottom-idle": "bottom-idle 7s ease-in-out infinite",
        "background-top-loading": "top-idle 4s ease-in-out infinite",
        "background-bottom-loading": "bottom-idle 4s ease-in-out infinite",
        "slow-spin": "spin-slow 7s linear infinite",
      },
    },
  },
  plugins: [],
};
