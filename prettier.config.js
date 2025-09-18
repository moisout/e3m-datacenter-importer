/**
 * @type {import("prettier").Config}
 */
const config = {
  trailingComma: 'es5',
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  plugins: [require.resolve('prettier-plugin-organize-imports')],
};

module.exports = config;
