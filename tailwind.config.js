/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Jost_400Regular", "sans-serif"],
        jost: ["Jost_400Regular", "sans-serif"],
        "jost-medium": ["Jost_500Medium", "sans-serif"],
        "jost-semibold": ["Jost_600SemiBold", "sans-serif"],
        "jost-bold": ["Jost_700Bold", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      colors: {
        primary: "#000000",
        secondary: "#808080",
        background: "#FCFBFC",
        light: {
          100: "#F0F0F0",
          200: "#828282",
          300: "#D3D3D3",
        },
        dark: {
          100: "#000000",
          200: "#E8E8E8",
        },
        accent: "#FFFFFF",
      },
    },
  },
  plugins: [],
};
