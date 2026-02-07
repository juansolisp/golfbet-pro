module.exports = {
  extends: ['@golfbet/eslint-config'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
  env: {
    node: true,
    jest: true,
  },
};
