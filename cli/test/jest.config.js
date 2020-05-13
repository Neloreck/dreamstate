// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");

module.exports = {
  "coveragePathIgnorePatterns": [
    "node_modules",
    "<rootDir>/tests/"
  ],
  setupFilesAfterEnv: [
    path.resolve(__dirname, "setup_tests.js")
  ],
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  rootDir: "../..",
  transform: {
    "^.+\\.[t|j]sx?$": [ "babel-jest", { configFile: path.resolve(__dirname, "babel.test.config.js") } ]
  },
  globals: {
    IS_DEV: false,
    IS_DEBUG: false
  }
};
