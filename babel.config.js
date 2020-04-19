module.exports = api => {
  const isTest = Boolean(api.env && api.env('test'));

  if (isTest) {
    return {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              node: "current"
            },
            modules: false,
            loose: true
          }
        ],
        "@babel/preset-typescript"
      ],
      plugins: [
        "macros",
        "@babel/plugin-transform-modules-commonjs",
        [ "@babel/plugin-proposal-decorators", { legacy: true } ],
        [ "@babel/plugin-proposal-class-properties", { loose: true } ]
      ]
    }
  } else {
    return {
      presets: [
        [
          "@babel/preset-env",
          {
            targets: {
              browsers: [ "ie >= 11" ]
            },
            exclude: [ "transform-async-to-generator", "transform-regenerator" ],
            modules: false,
            loose: true
          }
        ],
        "@babel/preset-typescript"
      ],
      plugins: [
        "macros",
        [ "@babel/plugin-proposal-class-properties", { loose: true } ]
      ]
    }
  }
};
