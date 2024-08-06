module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: ["eslint:recommended", "plugin:prettier/recommended"],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: "module",
  },
  rules: {
    // Add your custom rules here
    "no-console": "error", // Disallow the use of console.log
    "no-unused-vars": "error", // Disallow unused variables
    "no-undef": "error", // Disallow undeclared variables
    "no-extra-semi": "error", // Disallow unnecessary semicolons
    "no-trailing-spaces": "error", // Disallow trailing spaces
    "no-multiple-empty-lines": ["error", { max: 1 }], // Limit consecutive empty lines to 1
    "comma-dangle": ["error", "always-multiline"], // Require trailing commas in multiline object and array literals
    quotes: ["error", "single"], // Require single quotes
    semi: ["error", "always"], // Require semicolons
  },
};
