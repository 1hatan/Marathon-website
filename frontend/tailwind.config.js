/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          crimson: '#E6005C',
          crimsonHover: '#CC0052',
          pink: '#FF2E7E',
          cyan: '#00A3FF',
          teal: '#00C896',
          dark: '#0B0F19',
          canvas: '#FAF9FC',
          slate: '#1E293B',
          muted: '#64748B',
        },
        rock: {
          blue: '#1DA1F2',
          cyan: '#00A3FF',
          yellow: '#F5CD19',
          yellowHover: '#E5BD09',
          dark: '#111827',
          grayBg: '#F3F4F6',
          textGray: '#6B7280',
        },
        navy: {
          900: '#0B1220',
          800: '#131D33',
          700: '#1D2A47',
          600: '#2A3C63',
        },
        orange: {
          500: '#FF6B35',
          600: '#E85520',
          700: '#C74111',
        },
        charcoal: {
          900: '#111827',
          800: '#1F2937',
          700: '#374151',
          500: '#6B7280',
          300: '#D1D5DB',
        },
        offwhite: '#FFFFFF',
        success: '#16A34A',
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
        outfit: ['Outfit', 'sans-serif'],
        oswald: ['Oswald', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
