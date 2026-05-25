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
        // GPadel brand palette (matches the vibrant blue courts in Tskneti)
        brand: {
          blue: "#2196F3",       // primary accent / CTAs
          blueDark: "#1E88E5",   // hover state
          blueLight: "#90CAF9",  // subtle hover backgrounds
          blueSoft: "#E3F2FD",   // tinted card backgrounds
          ink: "#54595F",        // primary text / dark gray
          gray: "#7A7A7A",       // body text
          mute: "#A7AAAD",       // muted text
          line: "#E5E5E9",       // borders
          surface: "#F7F7F8",    // light card surface
        },
        primary: {
          50:  "#E3F2FD",
          100: "#BBDEFB",
          200: "#90CAF9",
          300: "#64B5F6",
          400: "#2196F3",   // main CTA — vibrant Material Blue
          500: "#1E88E5",
          600: "#1976D2",
          700: "#1565C0",
          800: "#0D47A1",
          900: "#0A3880",
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
