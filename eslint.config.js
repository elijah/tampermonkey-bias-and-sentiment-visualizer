/**
 * ESLint configuration for the project (flat config format)
 */
const js = require('@eslint/js');

module.exports = [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2021,
      sourceType: 'module',
      globals: {
        browser: true,
        document: true,
        window: true,
        localStorage: true,
        MutationObserver: true,
        NodeFilter: true,
        console: true,
        alert: true,
        confirm: true,
        module: true,
        require: true,
        jest: true,
        describe: true,
        test: true,
        expect: true,
        beforeEach: true,
        afterEach: true,
        it: true,
        beforeAll: true,
        afterAll: true,
      }
    },
    rules: {
      'no-console': 'off',
      'no-unused-vars': ['error', {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^(document|window|localStorage|MutationObserver|NodeFilter)$'
      }],
      'no-undef': 'off'
    }
  }
];