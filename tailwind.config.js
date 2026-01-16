/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors
        primary: {
          DEFAULT: '#24A54F',
          dark: '#063B29',
          light: '#829D94',
          600: '#1e8f42',
        },
        // Semantic colors (flat, not nested)
        success: '#24A54F',
        warning: '#E8A593',
        error: '#DE7573',
        
        // Neutrals (flat)
        'neutral-stroke': '#E4E3E0',
        'neutral-secondary': '#829D94',
        'neutral-bg': '#F7F6F2',
        
        // Status colors (flat)
        'status-open': '#24A54F',
        'status-full': '#DE7573',
        'status-cancelled': '#829D94',
      },
      fontFamily: {
        sans: ['Afacad', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '20px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'card-hover': '0 4px 12px rgba(0, 0, 0, 0.1)',
      }
    },
  },
  plugins: [],
}