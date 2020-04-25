export const BABEL_CONFIG = {
  extensions: [ ".ts", ".js" ],
  presets: [
    "@babel/preset-typescript"
  ],
  plugins: [
    "macros",
    [
      "module-resolver",
      {
        "root": [ "./" ],
        "alias": {
          "@Build": "./build"
        }
      }
    ]
  ]
};
