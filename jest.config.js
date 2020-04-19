module.exports = {
  transform: {
    "^.+\\.[t|j]sx?$": "babel-jest"
  },
  globals: {
    IS_DEV: false,
    IS_DEBUG: false
  }
};
