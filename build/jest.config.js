module.exports = {
  "coveragePathIgnorePatterns": [
    "node_modules",
    "<rootDir>/tests/"
  ],
  setupFilesAfterEnv: [
    "<rootDir>tests/helpers/setup/index.js"
  ],
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  rootDir: "../",
  transform: {
    "^.+\\.[t|j]sx?$": [ "babel-jest", { configFile: "./build/babel.test.config.js" } ]
  },
  globals: {
    IS_DEBUG: false
  }
};
