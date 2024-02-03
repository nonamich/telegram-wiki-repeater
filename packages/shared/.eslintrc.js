/** @type {import("eslint").Linter.Config} */
module.exports = {
  extends: [
    '@repo/eslint-config/node.js'
  ],
  rules: {
    '@typescript-eslint/no-namespace': 'off'
  }
};
