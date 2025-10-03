import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Colores Mararena - Primary (Azul Mararena)
        primary: {
          '50': 'var(--color-primary-50)',
          '100': 'var(--color-primary-100)',
          '200': 'var(--color-primary-200)',
          '300': 'var(--color-primary-300)',
          '400': 'var(--color-primary-400)',
          '500': 'var(--color-primary-500)',
          '600': 'var(--color-primary-600)', // #1B2B3A - Azul principal
          '700': 'var(--color-primary-700)',
          '800': 'var(--color-primary-800)',
          '900': 'var(--color-primary-900)',
          DEFAULT: 'var(--color-primary-600)',
          foreground: 'hsl(var(--primary-foreground))'
        },
        // Colores Mararena - Accent (Dorado Premium)
        accent: {
          '50': 'var(--color-accent-50)',
          '100': 'var(--color-accent-100)',
          '200': 'var(--color-accent-200)',
          '300': 'var(--color-accent-300)',
          '400': 'var(--color-accent-400)',
          '500': 'var(--color-accent-500)', // #D4AF37 - Dorado principal
          '600': 'var(--color-accent-600)',
          '700': 'var(--color-accent-700)',
          '800': 'var(--color-accent-800)',
          '900': 'var(--color-accent-900)',
          DEFAULT: 'var(--color-accent-500)',
          foreground: 'hsl(var(--accent-foreground))'
        },
        // Colores Mararena - Neutral (Blancos y Cremas)
        neutral: {
          '50': 'var(--color-neutral-50)',   // #FFFEFE - Blanco
          '100': 'var(--color-neutral-100)', // #FBF9F1 - Crema Suave
          '200': '#f5f5f4',
          '300': '#e5e5e5',
          '400': '#a3a3a3',
          '500': '#737373',
          '600': '#525252',
          '700': '#404040',
          '800': '#262626',
          '900': '#171717',
          DEFAULT: 'var(--color-neutral-50)',
        },
        // Mantener colores del template para compatibilidad con shadcn/ui
        secondary: {
          '50': 'var(--color-secondary-50)',
          '100': 'var(--color-secondary-100)',
          '200': 'var(--color-secondary-200)',
          '300': 'var(--color-secondary-300)',
          '400': 'var(--color-secondary-400)',
          '500': 'var(--color-secondary-500)',
          '600': 'var(--color-secondary-600)',
          '700': 'var(--color-secondary-700)',
          '800': 'var(--color-secondary-800)',
          '900': 'var(--color-secondary-900)',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))'
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['Inter', 'system-ui', 'sans-serif'],
        accent: ['Cormorant', 'serif'],
      },
    }
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;