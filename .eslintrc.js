// .eslintrc.js
module.exports = {
  extends: ['expo', 'plugin:react-native/all'],
  ignorePatterns: ['/dist/*'],
  plugins: ['react-hooks', 'import', 'react-native'],
  rules: {
    'react-hooks/exhaustive-deps': 'off',
    'no-console': ['error', { allow: ['error'] }],
    'import/no-unresolved': 'off',
    'import/namespace': 'off',
    'react/display-name': 'off',
    'react-native/no-raw-text': 'off',
    'react/jsx-no-target-blank': 'off',
    'react/no-unescaped-entities': 'off',
    'react-native/no-inline-styles': 'off',
    'react-native/no-color-literals': 'off',
    'react-native/sort-styles': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};
