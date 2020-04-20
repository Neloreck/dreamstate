module.exports = {
  setupFilesAfterEnv: [
    "<rootDir>src/tests/helpers/setup/index.js"
  ],
  snapshotSerializers: [
    "enzyme-to-json/serializer"
  ],
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  globals: {
    IS_DEV: false,
    IS_DEBUG: false
  }
};
