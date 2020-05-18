import * as path from "path";

import { default as replace } from "@rollup/plugin-replace";
import { default as typescript } from "@rollup/plugin-typescript";
import * as react from "react";
import { default as babel } from "rollup-plugin-babel";
import { default as commonjs } from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

import {
  CORE_ENTRY,
  TEST_UTILS_ENTRY,
  TS_BUILD_CONFIG,
  CJS_ROOT,
  EEnvironment
} from "../config/build.constants";

import { BABEL_CONFIG } from "./babel.modern.config";

const createCjsConfig = (env) => ({
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
    compact: env === EEnvironment.PRODUCTION,
    dir: path.resolve(CJS_ROOT, env),
    sourcemap: true,
    format: "cjs"
  },
  plugins: [
    babel(BABEL_CONFIG),
    commonjs({
      namedExports: { react: Object.keys(react) }
    }),
    replace({
      IS_DEV: (env !== EEnvironment.PRODUCTION).toString()
    }),
    typescript({
      tsconfig: TS_BUILD_CONFIG,
      declaration: false
    })
  ].concat(env === EEnvironment.PRODUCTION ? [ terser({ output: { beautify: false, comments: false } }) ] : [])
});

export default [ createCjsConfig(EEnvironment.PRODUCTION), createCjsConfig(EEnvironment.DEVELOPMENT) ];
