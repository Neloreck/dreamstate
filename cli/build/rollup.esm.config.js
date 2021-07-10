import * as path from "path";

import { default as replace } from "@rollup/plugin-replace";
import { default as typescript } from "@rollup/plugin-typescript";
import * as react from "react";
import { default as babel } from "rollup-plugin-babel";
import { default as clear } from "rollup-plugin-clear";
import { default as commonjs } from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";
import { visualizer } from "rollup-plugin-visualizer";

import {
  CORE_ENTRY,
  ESM_ROOT,
  TS_BUILD_CONFIG,
  EEnvironment,
  DS_ROOT,
  STATS_ROOT
} from "../config/build.constants";

import { BABEL_CONFIG } from "./babel.modern.config";

const createEsmConfig = (env) => ({
  external: [
    "react",
    "shallow-equal",
    "tslib"
  ],
  preserveModules: true,
  input: CORE_ENTRY,
  output: {
    compact: env === EEnvironment.PRODUCTION,
    dir: path.resolve(ESM_ROOT, env),
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
      preventAssignment: true,
      IS_DEV: env !== EEnvironment.PRODUCTION
    }),
    typescript({
      tsconfig: TS_BUILD_CONFIG,
      pretty: env !== EEnvironment.PRODUCTION,
      declaration: false
    })
  ]
    .concat(env === EEnvironment.PRODUCTION ? [ terser({ output: { beautify: false, comments: false } }) ] : [])
    .concat([
      visualizer({
        filename: path.resolve(STATS_ROOT, `esm-${env}-stats.html`),
        gzipSize: true,
        projectRoot: DS_ROOT
      }),
      clear({
        targets: [ path.resolve(ESM_ROOT, env) ]
      })
    ])
});

export default [ createEsmConfig(EEnvironment.PRODUCTION), createEsmConfig(EEnvironment.DEVELOPMENT) ];
