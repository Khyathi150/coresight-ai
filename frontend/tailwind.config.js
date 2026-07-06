/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#080B14",
          900: "#0B1020",
          800: "#111832",
          700: "#1A2242",
          600: "#242E52",
        },
        signal: {
          amber: "#E08D2C",
          amberSoft: "#F2B366",
          teal: "#3FB8AF",
          tealSoft: "#7ED4CC",
          red: "#C1483C",
        },
        mist: {
          100: "#F4F5F9",
          300: "#C7CCDB",
          500: "#8A90A8",
          700: "#5A6079",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        panel: "0 1px 0 0 rgba(255,255,255,0.04) inset, 0 8px 24px -8px rgba(0,0,0,0.5)",
        glow: "0 0 24px -4px rgba(224,141,44,0.35)",
      },
      backgroundImage: {
        "grid-fade": "radial-gradient(circle at 20% -10%, rgba(63,184,175,0.12), transparent 45%), radial-gradient(circle at 90% 10%, rgba(224,141,44,0.10), transparent 40%)",
      },
      keyframes: {
        pulseLine: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.4)" },
        },
        drift: {
          "0%": { backgroundPosition: "0% 0%" },
          "100%": { backgroundPosition: "100% 100%" },
        },
        rise: {
          "0%": { opacity: 0, transform: "translateY(8px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
      },
      animation: {
        pulseLine: "pulseLine 1.6s ease-in-out infinite",
        drift: "drift 12s linear infinite alternate",
        rise: "rise 0.5s ease-out forwards",
      },
    },
  },
  plugins: [],
};
