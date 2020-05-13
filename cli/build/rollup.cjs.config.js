import * as path from "path";
import * as react from "react";

import { default as typescript } from "@rollup/plugin-typescript";
import { default as replace } from "@rollup/plugin-replace";
import { default as babel } from "rollup-plugin-babel";
import { default as commonjs } from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { default as multiinput } from "rollup-plugin-multi-input";

import { BABEL_CONFIG } from "./babel.modern.config";

const ENV = process.env.NODE_ENV || "development";
const IS_PRODUCTION = ENV === "production";
const IS_DEBUG = ENV === "debug";

export const CJS_CONFIG = {
  external: [ "react", "shallow-equal", "hoist-non-react-statics", "tslib" ],
  input: [ "./src/index.ts", "./src/test-utils.ts" ],
  output: {
    chunkFileNames: "cjs/lib.js",
    compact: IS_PRODUCTION,
    dir: "./",
    name: `dreamstate.${ENV}.js`,
    sourcemap: true,
    format: "cjs"
  },
  plugins: [
    multiinput(),
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
      tsconfig: path.resolve(__dirname, "./tsconfig.build.json"),
      declaration: false
    })
  ].concat(
    IS_PRODUCTION
      ? [
        terser({
          output: {
            beautify: false,
            comments: false
          }
        })
      ]
      : []
  )
};

export default CJS_CONFIG;
