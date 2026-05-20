import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // GPadel brand palette (matches gpadel.ge Elementor kit)
        brand: {
          green: "#61CE70",      // primary accent / CTAs
          greenDark: "#4FB45E",  // hover state
          greenLight: "#A8E5B1", // subtle hover backgrounds
          greenSoft: "#E8F8EC",  // tinted card backgrounds
          blue: "#6EC1E4",       // secondary accent
          blueDark: "#4FA9CC",
          ink: "#54595F",        // primary text / dark gray
          gray: "#7A7A7A",       // body text
          mute: "#A7AAAD",       // muted text
          line: "#E5E5E9",       // borders
          surface: "#F7F7F8",    // light card surface
        },
        primary: {
          50: "#E8F8EC",
          100: "#D1F1D8",
          200: "#A8E5B1",
          300: "#80D88A",
          400: "#61CE70",   // matches Elementor accent
          500: "#4FB45E",
          600: "#3F9A4E",
          700: "#308040",
          800: "#236532",
          900: "#174A24",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
