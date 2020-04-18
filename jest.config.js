module.exports = {
  transform: { "\\.ts$": [ "ts-jest" ] },
  globals: {
    IS_DEV: false,
    'ts-jest': {
      tsConfig: 'tsconfig.test.json'
    }
  }
};
