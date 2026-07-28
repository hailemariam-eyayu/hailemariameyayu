/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50:  '#eff6ff',
          100: '#dbeafe',
          400: '#60a5fa',
          500: '#3b82f6',
          600: '#2563eb',
          700: '#1d4ed8',
        },
        dark: {
          900: '#0a0f1e',
          800: '#0d1526',
          700: '#111827',
          600: '#1a2235',
          500: '#1e2a3a',
        },
        // Light mode surface tokens
        light: {
          bg:      '#f8fafc',
          surface: '#ffffff',
          card:    '#f1f5f9',
          border:  '#e2e8f0',
          muted:   '#64748b',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'fade-in':     'fadeIn 0.6s ease-out forwards',
        'slide-up':    'slideUp 0.6s ease-out forwards',
        'pulse-slow':  'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float':       'float 6s ease-in-out infinite',
        'glow':        'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        fadeIn:    { '0%': { opacity: '0' },                                          '100%': { opacity: '1' } },
        slideUp:   { '0%': { opacity: '0', transform: 'translateY(30px)' },           '100%': { opacity: '1', transform: 'translateY(0)' } },
        float:     { '0%, 100%': { transform: 'translateY(0px)' },                    '50%':  { transform: 'translateY(-20px)' } },
        glow:      { '0%': { boxShadow: '0 0 5px #3b82f6, 0 0 10px #3b82f6' },       '100%': { boxShadow: '0 0 20px #3b82f6, 0 0 40px #3b82f6' } },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%233b82f6' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
