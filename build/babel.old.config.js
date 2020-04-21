export const BABEL_CONFIG = {
  extensions: [ ".ts", ".js" ],
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
  ]
};
