import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        Roboto: ["Roboto", "sans-serif"],

      },
      colors: {
        // background: "var(--background)",
        // foreground: "var(--foreground)",
      },
      animation: {
        'pg-jitter': 'pg-jitter 0.44s ease-in-out infinite',
        'pg-sweep': 'pg-sweep 0.9s ease-in-out infinite',
        'fadeSlideUp': 'fadeSlideUp 0.22s ease-out',
      },
      keyframes: {
        'pg-jitter': {
          '0%': { transform: 'translate3d(0,0,0) rotate(0)' },
          '20%': { transform: 'translate3d(calc(-1 * var(--pg-jitter-x)), var(--pg-jitter-y), 0) rotate(calc(-1 * var(--pg-jitter-deg)))' },
          '40%': { transform: 'translate3d(var(--pg-jitter-x), calc(-0.75 * var(--pg-jitter-y)), 0) rotate(var(--pg-jitter-deg))' },
          '60%': { transform: 'translate3d(calc(-0.6 * var(--pg-jitter-x)), calc(0.5 * var(--pg-jitter-y)), 0) rotate(calc(-0.6 * var(--pg-jitter-deg)))' },
          '80%': { transform: 'translate3d(calc(0.6 * var(--pg-jitter-x)), calc(-0.4 * var(--pg-jitter-y)), 0) rotate(calc(0.6 * var(--pg-jitter-deg)))' },
          '100%': { transform: 'translate3d(0,0,0) rotate(0)' },
        },
        'pg-sweep': {
          '0%': { backgroundPositionX: '150%' },
          '50%': { backgroundPositionX: '-50%' },
          '100%': { backgroundPositionX: '150%' },
        },
        'fadeSlideUp': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
