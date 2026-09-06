/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#002147',      // Primary Official Deep Navy
          dark: '#0A192F',      // Header background
          blue: '#1B365D',      // Accent navy
          ashoka: '#0B4F6C',    // Secondary Ashoka Blue
          saffron: '#D97706',   // Tricolor saffron accent
          green: '#15803D',     // Tricolor green accent
          border: '#CBD5E1',    // Subtle clean borders
          bg: '#F8FAFC',        // Slate light background
          surface: '#FFFFFF',
          text: '#0F172A',
          muted: '#475569'
        }
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'system-ui', 'sans-serif'],
        serif: ['Merriweather', 'Georgia', 'serif']
      }
    },
  },
  plugins: [],
}
