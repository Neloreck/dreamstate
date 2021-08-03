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
    "@babel/preset-typescript",
    "@babel/preset-react"
  ],
  plugins: [
    "@babel/plugin-transform-modules-commonjs",
    [ "@babel/plugin-proposal-decorators", { legacy: true } ],
    [ "@babel/plugin-proposal-class-properties", { loose: true } ],
    [
      "module-resolver",
      {
        root: [ "./" ],
        alias: {
          "@": "./src"
        }
      }
    ],
    "macros"
  ]
};
