import type { Config } from "tailwindcss";

/**
 * Design tokens are lifted verbatim from the reference build
 * (../alperen-site/dist/index.html <style> block). Do not "improve" these
 * values — they are the source of truth for the pixel-perfect design.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        // the reference swaps to its desktop layout at exactly 960px
        // (matchMedia('(min-width: 960px)'))
        desk: "960px",
      },
      colors: {
        paper: "#F4EFE6", // page background
        "paper-warm": "#EEE6D7", // trust strip / süreç
        "paper-cool": "#F8F5EE", // kanıt / sss
        "card-cream": "#F8F3EA", // model cards
        "ink-deep": "#0E0E0C", // primary ink / dark sections
        "ink-soft": "#1C1B17", // secondary ink
        gold: "#B8956A",
        clay: "#8A6F4F",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "Georgia", "serif"],
        accent: ["var(--font-instrument)", "Georgia", "serif"],
        body: ["var(--font-archivo)", "sans-serif"],
      },
      letterSpacing: {
        // 0.24em is the signature label tracking used across the whole design
        label: "0.24em",
        tight: "-0.015em", // display headings
      },
      spacing: {
        header: "64px",
        "section-mobile": "42px",
      },
      transitionTimingFunction: {
        // the site's one and only easing curve
        smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        aaFadeUp: {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        aaMarquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "fade-up": "aaFadeUp 0.9s cubic-bezier(0.16,1,0.3,1) both",
        marquee: "aaMarquee 55s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
