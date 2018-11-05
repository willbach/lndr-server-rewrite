module.exports = {
  env: {
    es6: true,
    node: true
  },
  extends: [
    'eslint:recommended',
    'plugin:ante/recommended',
    'plugin:ante/style'
  ],
  parser: "typescript-eslint-parser",
  parserOptions: {
    ecmaFeatures: {
      experimentalObjectRestSpread: true
    },
    ecmaVersion: 6,
    sourceType: 'module'
  },
  plugins: [
    'typescript'
  ],
  rules: {
    semi: ["error", "never"],
    'no-unused-vars': ["error", { "argsIgnorePattern": "_" }],
    'typescript/no-unused-vars': 1,
    'prefer-destructuring': 0,
    'max-params': ["error", 4],
    'no-console': ["error", { allow: ["warn", "error"] }],
    'id-blacklist': [
      'error',
      'e',
      'el',
      'evt'
    ],
    'no-magic-numbers': [
      'error',
      {
        ignore: [
          -1,
          0,
          1,
          2,
          3,
          4,
          6,
          10,
          16,
          18,
          27,
          32,
          64,
          100,
          128
        ]
      }
    ]
  }
};
