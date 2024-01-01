module.exports = {
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: 'plugin:react/recommended',
  overrides: [
    {
      env: {
        node: true,
      },
      files: ['.eslintrc.{js,cjs}'],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname, // <-- this did the trick for me
  },
  plugins: ['@typescript-eslint', 'react'],
  rules: {},
};
