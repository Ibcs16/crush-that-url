module.exports = {
  env: {
    es6: true,
    node: true,
  },

  extends: [
    'airbnb-base',
    'prettier'
  ],
  plugins: [
    'prettier'
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    "prettier/prettier": "error",
    // "linebreak-style": ["error", "no"],
    "class-methods-use-this": "off",
    "no-param-reassign": "off",
    "camelcase": "off",
    "no-undef": ["error", {"argsIgnorePattern": ["describe", "it", "expect", "beforeAll", "afterAll", "afterEach"]}],
    "no-unused-vars": ["error", { "argsIgnorePattern": "next" } ]
  },
};
