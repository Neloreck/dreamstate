export const BABEL_CONFIG = {
  extensions: [".ts", ".js"],
  presets: [
    [
      "@babel/preset-env",
      {
        modules: false,
        loose: true,
        targets: "> 0.5%",
      },
    ],
    "@babel/preset-typescript",
  ],
  plugins: [
    "macros",
    [
      "module-resolver",
      {
        root: ["./"],
        alias: {
          "@": "./src",
        },
      },
    ],
  ],
};
