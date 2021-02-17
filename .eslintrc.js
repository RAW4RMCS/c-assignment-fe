module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'prettier/@typescript-eslint',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['*.css'],
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'error',
    "comma-dangle": ["error", "only-multiline"],
    'indent': ["error", "tab", {"SwitchCase": 1}],
    'object-property-newline': ["error", { "allowMultiplePropertiesPerLine": true }],
    'brace-style': ["error", "1tbs"],
    'prettier/prettier': 0,
		'no-empty-function': 'off',
		'quotes': ["error", "single"],
		'jsx-quotes': ["error", "prefer-single"],
    '@typescript-eslint/no-empty-function': ["error", { 
      "allow": ["functions", "arrowFunctions"]
    }],
  },
};