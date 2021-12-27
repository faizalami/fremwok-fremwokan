module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: [
    'standard',
  ],
  plugins: [
    'import',
  ],
  rules: {
    'comma-dangle': ['error', 'always-multiline'],
    semi: ['error', 'always'],
  },
};
