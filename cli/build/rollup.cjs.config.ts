import * as path from "path";

import { babel } from "@rollup/plugin-babel";
import { default as commonjs } from "@rollup/plugin-commonjs";
import { default as replace } from "@rollup/plugin-replace";
import { default as terser } from "@rollup/plugin-terser";
import { default as typescript } from "@rollup/plugin-typescript";
import * as react from "react";
import { default as clear } from "rollup-plugin-clear";
import { visualizer } from "rollup-plugin-visualizer";

import {
  CORE_ENTRY,
  TEST_UTILS_ENTRY,
  TS_BUILD_CONFIG,
  CJS_ROOT,
  EEnvironment,
  DS_ROOT,
  STATS_ROOT
} from "../config/build.constants";

import { BABEL_CONFIG } from "./babel.modern.config";

const createCjsConfig = (env) => ({
  external: [ "react", "shallow-equal", "tslib" ],
  input: [ CORE_ENTRY, TEST_UTILS_ENTRY ],
  output: {
    chunkFileNames: "lib.js",
    compact: env === EEnvironment.PRODUCTION,
    dir: path.resolve(CJS_ROOT, env),
    sourcemap: true,
    format: "cjs"
  },
  plugins: [
    commonjs(),
    babel({ ...BABEL_CONFIG, babelHelpers: "bundled" }),
    replace({
      preventAssignment: true,
      IS_DEV: (env !== EEnvironment.PRODUCTION).toString()
    }),
    typescript({
      tsconfig: TS_BUILD_CONFIG,
      declaration: false
    })
  ]
    .concat(env === EEnvironment.PRODUCTION ? [ terser({ output: { beautify: false, comments: false } }) ] : [])
    .concat([
      visualizer({
        filename: path.resolve(STATS_ROOT, `cjs-${env}-stats.html`),
        gzipSize: true,
        projectRoot: DS_ROOT
      }),
      clear({
        targets: [ path.resolve(CJS_ROOT, env) ]
      })
    ])
});

export default [ createCjsConfig(EEnvironment.PRODUCTION), createCjsConfig(EEnvironment.DEVELOPMENT) ];
