module.exports = {
  extends: ['@modern-js'],
  ignorePatterns: ['compiled/'],
  parserOptions: {
    project: require.resolve('./tsconfig.json'),
  },
  rules: {
    'import/order': 0,
  },
};
