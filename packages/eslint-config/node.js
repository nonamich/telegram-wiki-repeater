/** @type {import("eslint").Linter.Config} */
module.exports = {
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint/eslint-plugin', 'perfectionist'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'perfectionist/sort-imports': [
      'error',
      {
        'type': 'natural',
        'order': 'asc',
        groups: [
          'bootstrap',
          'type',
          'builtin',
          '@nestjs',
          'external',
          '@repo',
          'internal-type',
          'internal',
          ['parent-type', 'sibling-type', 'index-type'],
          ['parent', 'sibling', 'index'],
          'object',
          'unknown',
        ],
        'custom-groups': {
          value: {
            '@nestjs': ['@nestjs/**'],
            'bootstrap': ['dotenv', 'dotenv*', './bootstrap*', './instrument*'],
            '@repo': ['@repo/*'],
          },
        },
      }
    ],
  },
};
