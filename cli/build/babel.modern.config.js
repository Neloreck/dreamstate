import * as path from "path";

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
          "@Macro": path.resolve(__dirname, "./macroses"),
          "@Lib": "./src"
        }
      }
    ],
    "macros"
  ]
};
