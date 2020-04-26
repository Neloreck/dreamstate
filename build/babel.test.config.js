module.exports = {
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
    [ "@babel/plugin-proposal-class-properties", { loose: true } ],
    [
      "module-resolver",
      {
        "root": [ "./" ],
        "alias": {
          "@Build": "./build",
          "@Lib": "./src",
          "@Tests": "./tests"
        }
      }
    ]
  ]
};
