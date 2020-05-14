import { default as replace } from "@rollup/plugin-replace";
import { default as typescript } from "@rollup/plugin-typescript";
import * as react from "react";
import { default as babel } from "rollup-plugin-babel";
import { default as commonjs } from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

import {
  IS_PRODUCTION,
  IS_DEBUG,
  CORE_ENTRY,
  TEST_UTILS_ENTRY,
  TS_BUILD_CONFIG,
  CJS_ROOT
} from "../config/build.constants";

import { BABEL_CONFIG } from "./babel.modern.config";

export const CJS_CONFIG = {
  external: [
    "react",
    "shallow-equal",
    "hoist-non-react-statics",
    "tslib"
  ],
  input: [
    CORE_ENTRY,
    TEST_UTILS_ENTRY
  ],
  output: {
    chunkFileNames: "lib.js",
    compact: IS_PRODUCTION,
    dir: CJS_ROOT,
    sourcemap: true,
    format: "cjs"
  },
  plugins: [
    babel(BABEL_CONFIG),
    commonjs({
      namedExports: { react: Object.keys(react) }
    }),
    replace({
      IS_DEV: (!IS_PRODUCTION).toString(),
      IS_DEBUG: IS_DEBUG.toString()
    }),
    typescript({
      tsconfig: TS_BUILD_CONFIG,
      declaration: false
    })
  ].concat(IS_PRODUCTION ? [ terser({ output: { beautify: false, comments: false } }) ] : [])
};

export default CJS_CONFIG;
