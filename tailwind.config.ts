
import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        border: '#222',
        input: '#222',
        ring: '#111',
        background: '#fff',
        foreground: '#000',
        primary: {
          DEFAULT: '#000',
          foreground: '#fff'
        },
        secondary: {
          DEFAULT: '#f1f1f1',
          foreground: '#000'
        },
        destructive: {
          DEFAULT: '#f00',
          foreground: '#fff'
        },
        muted: {
          DEFAULT: '#f1f1f1',
          foreground: '#222'
        },
        accent: {
          DEFAULT: '#f1f1f1',
          foreground: '#000'
        },
        popover: {
          DEFAULT: '#fff',
          foreground: '#000'
        },
        card: {
          DEFAULT: '#fff',
          foreground: '#000'
        }
      },
      borderRadius: {
        lg: '1rem',
        md: '0.5rem',
        sm: '0.25rem'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
