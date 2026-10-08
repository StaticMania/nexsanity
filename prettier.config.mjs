const prettierConfig = {
  semi: false,
  singleQuote: true,
  jsxSingleQuote: false,
  printWidth: 100,
  tabWidth: 2,
  trailingComma: 'all',
  arrowParens: 'always',
  bracketSpacing: true,
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: './app/globals.css',
  tailwindFunctions: ['cn'],
}

export default prettierConfig
