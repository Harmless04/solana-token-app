import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5D5FEF',
          light: '#8B8DFF',
          dark: '#4647B3',
        },
        secondary: {
          DEFAULT: '#14F195',
          light: '#60FBB8',
          dark: '#0CB974',
        },
        dark: {
          DEFAULT: '#1A202C',
          light: '#2D3748',
          lighter: '#4A5568',
        },
        light: {
          DEFAULT: '#F7FAFC',
          dark: '#EDF2F7',
          darker: '#E2E8F0',
        }
      }
    }
  },
  plugins: [],
}

export default config