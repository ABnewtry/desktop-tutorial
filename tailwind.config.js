/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    extend: {
      fontFamily: {
        cormorant: ['Cormorant', 'Georgia', 'serif'],
        montserrat: ['Montserrat', 'system-ui', 'sans-serif'],
      },
      fontWeight: {
        300: '300', 400: '400', 500: '500', 600: '600', 700: '700',
      },
      colors: {
        primary:   '#DB2777',
        secondary: '#F472B6',
        cta:       '#CA8A04',
        bg:        '#FDF2F8',
        deep:      '#831843',
      },
      animation: {
        'float':      'float 6s ease-in-out infinite',
        'float-slow': 'float 9s ease-in-out infinite',
        'slide-up':   'slideUp 0.8s cubic-bezier(.16,1,.3,1) forwards',
        'fade-in':    'fadeIn 1s ease forwards',
        'shimmer':    'shimmer 2.5s linear infinite',
      },
      keyframes: {
        float:   { '0%,100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-18px)' } },
        slideUp: { from: { opacity: '0', transform: 'translateY(40px)' }, to: { opacity: '1', transform: 'translateY(0)' } },
        fadeIn:  { from: { opacity: '0' }, to: { opacity: '1' } },
        shimmer: { '0%': { backgroundPosition: '-200% center' }, '100%': { backgroundPosition: '200% center' } },
      },
    },
  },
  plugins: [],
};
