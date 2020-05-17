import * as path from "path";

import { default as replace } from "@rollup/plugin-replace";
import { default as typescript } from "@rollup/plugin-typescript";
import * as react from "react";
import { default as babel } from "rollup-plugin-babel";
import { default as commonjs } from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

import { IS_PRODUCTION, IS_DEBUG, CORE_ENTRY, ESM_ROOT, TS_BUILD_CONFIG, ENV } from "../config/build.constants";

import { BABEL_CONFIG } from "./babel.modern.config";

export const ESM_CONFIG = {
  external: [
    "react",
    "shallow-equal",
    "hoist-non-react-statics",
    "tslib"
  ],
  preserveModules: true,
  input: CORE_ENTRY,
  output: {
    compact: IS_PRODUCTION,
    dir: path.resolve(ESM_ROOT, ENV),
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
      tsconfig: TS_BUILD_CONFIG,
      pretty: !IS_PRODUCTION,
      declaration: false
    })
  ].concat(IS_PRODUCTION ? [ terser({ output: { beautify: false, comments: false } }) ] : [])
};

export default ESM_CONFIG;
