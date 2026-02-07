module.exports = {
  extends: ['@golfbet/eslint-config', 'next/core-web-vitals'],
  parserOptions: {
    project: './tsconfig.json',
    tsconfigRootDir: __dirname,
  },
};
