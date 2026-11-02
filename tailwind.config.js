/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        apple: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "SF Pro Text",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
      },
      colors: {
        cream: {
          50: "#FCFCF9",
          100: "#F7F6F0",
          200: "#EFECE1",
          300: "#E5E1D0",
        },
        forest: {
          50: "#F1F6F2",
          100: "#E2ECE3",
          500: "#2D5A27",
          600: "#234E1F",
          700: "#1A3D17",
          800: "#132E11",
          900: "#0D200B",
        },
        terracotta: {
          50: "#FDF5F2",
          100: "#FAE7E1",
          500: "#C85A32",
          600: "#B24C27",
          700: "#983D1D",
        },
        warmamber: {
          50: "#FFFBEB",
          100: "#FEF3C7",
          500: "#B45309",
          600: "#92400E",
        },
        charcoal: {
          DEFAULT: "#1D1D1F",
          muted: "#6E6E73",
          subtle: "#86868B",
        },
        edge: {
          DEFAULT: "#E5E5EA",
          light: "#F2F2F7",
        }
      },
      boxShadow: {
        'apple-sm': '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-card': '0 2px 8px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
        'apple-modal': '0 20px 40px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.05)',
      }
    },
  },
  plugins: [],
}
