const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  purge: [],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Aboriginal Sans', ...defaultTheme.fontFamily.sans],
        mono: [
          'JetBrains Mono',
        ],
      },
    },
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
  ],
}