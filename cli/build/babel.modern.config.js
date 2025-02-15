export const BABEL_CONFIG = {
  extensions: [".ts", ".js"],
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        loose: true,
        targets: "> 10%",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@": "./src",
        },
      },
    ],
    "macros",
  ],
};
