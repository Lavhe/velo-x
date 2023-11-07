const plugin = require('tailwindcss/plugin');

module.exports = {
  darkMode: 'class',
  content: ['**/*.ts', '**/*.tsx'],
  theme: {
    extend: {
      colors: {
        primary: '#1fcecb',
        secondary: '#818285'
      }
    }
  },
  plugins: [
    plugin(({ addUtilities }) => {
      addUtilities({
        // 😎 similar to `@apply`
        Text: `px-4 py-1 rounded-full bg-red-800 text-white`,
        '.body-text': `font-serif leading-relaxed tracking-wide text-gray-800`
      });
    })
  ]
};
