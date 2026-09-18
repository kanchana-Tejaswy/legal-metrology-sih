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
        serif: ['Merriweather', 'Georgia', 'serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace']
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(15, 23, 42, 0.05), 0 1px 2px -1px rgba(15, 23, 42, 0.04)',
        'card-hover': '0 4px 14px -2px rgba(15, 23, 42, 0.08), 0 2px 6px -2px rgba(15, 23, 42, 0.04)',
        'elevated': '0 12px 28px -4px rgba(15, 23, 42, 0.09), 0 4px 12px -2px rgba(15, 23, 42, 0.04)',
        'sticky-bar': '0 -4px 20px -2px rgba(15, 23, 42, 0.08), 0 -2px 6px -2px rgba(15, 23, 42, 0.03)'
      },
      borderRadius: {
        'card': '0.75rem',
        'card-lg': '1rem'
      }
    },
  },
  plugins: [],
}
