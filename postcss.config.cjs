// postcss.config.cjs (CommonJS 문법)
const tailwindcss = require('@tailwindcss/postcss');
const autoprefixer = require('autoprefixer');

module.exports = {
  plugins: [tailwindcss, autoprefixer],
};
