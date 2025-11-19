/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Custom scrollbar utilities
      scrollbar: {
        thin: '8px',
      },
    },
  },
  plugins: [
    function({ addUtilities }) {
      const scrollbarUtilities = {
        '.scrollbar-thin': {
          'scrollbar-width': 'thin',
        },
        '.scrollbar-thumb-cyan-600': {
          '&::-webkit-scrollbar-thumb': {
            'background-color': '#0891b2',
            'border-radius': '4px',
          },
        },
        '.scrollbar-track-slate-800': {
          '&::-webkit-scrollbar-track': {
            'background-color': '#1e293b',
          },
        },
        '.scrollbar-thin::-webkit-scrollbar': {
          width: '8px',
        },
      };
      addUtilities(scrollbarUtilities);
    },
  ],
};

