// https://docs.expo.dev/guides/using-eslint/
module.exports = {
  extends: ['expo', 'prettier'],
  plugins: ['prettier', 'jest'],
  rules: {
    'prettier/prettier': 'error',
  },
  env: {
    'jest/globals': true,
  },
};
