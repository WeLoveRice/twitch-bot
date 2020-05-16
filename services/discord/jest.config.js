module.exports = {
  testEnvironment: 'node',
  testMatch: ["**/tests/**/*.ts"],
  transform: {
    ".(ts|tsx)": "ts-jest"
  },
  globals: {
    "ts-jest": {
      "compiler": "ttypescript"
    }
  },
  setupFiles: [
    "<rootDir>ts-auto-mock-config.ts"
  ]
};