module.exports = {
  root: true,
  env: {
    es6: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:import/typescript',
    'google',
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['tsconfig.json', 'tsconfig.dev.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  ignorePatterns: [
    '/lib/**/*', // Ignore built files.
  ],
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    'quotes': ['error', 'single'],
    'operator-linebreak': [
      'error',
      'before',
      {'overrides': {'&&': 'after', '||': 'after'}},
    ],
    'space-before-function-paren': 'off',
    'arrow-body-style': ['error', 'always'],
    'import/no-unresolved': 0,
    'require-jsdoc': 0,
    'max-len': ['warn', {code: 100}],
    'linebreak-style': ['warn', 'windows'],
    'new-cap': 0,
    'indent': ['error', 2],
    '@typescript-eslint/no-var-requires': 0,
  },
};
