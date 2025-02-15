const path = require("path");

module.exports = {
  coveragePathIgnorePatterns: ["/node_modules/", "/fixtures/", "/types/", "/__tests__/"],
  coverageDirectory: "<rootDir>/target/coverage",
  setupFilesAfterEnv: [path.resolve(__dirname, "setup_tests.js")],
  snapshotSerializers: ["enzyme-to-json/serializer"],
  rootDir: "../..",
  transform: {
    "^.+\\.[t|j]sx?$": ["babel-jest", { configFile: path.resolve(__dirname, "babel.test.config.js") }],
  },
  testEnvironment: "jsdom",
  globals: {
    IS_DEV: false,
  },
};
