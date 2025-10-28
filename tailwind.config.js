export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ["Poppins", "sans-serif"],
        montserrat: ['"Montserrat"', "sans-serif"],
        spartan: ['"League Spartan"', "sans-serif"],
        fredoka: ['"Fredoka One"', "sans-serif"],
        nunito: ["Nunito", "sans-serif"],
      },
      colors: {
        darkBg: "var(--darkBg)",
        hoverColor: "var(--hoverColor)",
        lightBg: "var(--lightBg)",
        textColor: "var(--textColor)",
        dark: "var(--dark)",
        light: "var(--light)",
        lightGray: "var(--lightGray)",
        darkGray: "var(--darkGray)",
        bottelGreen: "#007672",
        lightBottelGreen: "#b2f1e89c",
      },
    },
  },
  plugins: [],
};
