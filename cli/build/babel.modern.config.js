export const BABEL_CONFIG = {
  extensions: [ ".ts", ".js" ],
  presets: [
    "@babel/preset-typescript"
  ],
  plugins: [
    [
      "module-resolver",
      {
        "root": [ "./" ],
        "alias": {
          "@Macro": "./cli/build/macroses",
          "@Lib": "./src"
        }
      }
    ],
    "macros"
  ]
};
