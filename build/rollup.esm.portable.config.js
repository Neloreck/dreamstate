import * as path from "path";
import * as react from "react";

import { default as typescript } from "@rollup/plugin-typescript";
import { default as replace } from "@rollup/plugin-replace";
import { default as babel } from "rollup-plugin-babel";
import { default as commonjs } from "rollup-plugin-commonjs";

import { BABEL_CONFIG } from "./babel.modern.config";

const ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = ENV === "production";
const IS_DEBUG = ENV === "debug";

export const ESM_CONFIG = {
  external: [ "react", "shallow-equal", "hoist-non-react-statics" ],
  input: "./src/index.ts",
  preserveModules: false,
  output: {
    compact: IS_PRODUCTION,
    dir: "./portable/",
    sourcemap: true,
    format: "es"
  },
  plugins: [
    commonjs({
      namedExports: {
        react: Object.keys(react)
      }
    }),
    babel(BABEL_CONFIG),
    replace({
      IS_DEV: !IS_PRODUCTION,
      IS_DEBUG: IS_DEBUG
    }),
    typescript({
      tsconfig: path.resolve(__dirname, "./tsconfig.portable.json"),
      declaration: false
    })
  ]
};

export default ESM_CONFIG;
