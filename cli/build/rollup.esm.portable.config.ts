import * as path from "path";

import { babel } from "@rollup/plugin-babel";
import { default as commonjs } from "@rollup/plugin-commonjs";
import { default as replace } from "@rollup/plugin-replace";
import { default as typescript } from "@rollup/plugin-typescript";
import { default as clear } from "rollup-plugin-clear";
import { default as dts } from "rollup-plugin-dts";
import { visualizer } from "rollup-plugin-visualizer";

import { default as tsconfig } from "../../tsconfig.json";
import {
  PORTABLE_ENTRY,
  TS_PORTABLE_CONFIG,
  PORTABLE_ROOT,
  EEnvironment,
  DS_ROOT,
  STATS_ROOT
} from "../config/build.constants";

import { BABEL_CONFIG } from "./babel.modern.config";

const createPortableConfig = (env) => ({
  external: [ "react", "shallow-equal" ],
  input: PORTABLE_ENTRY,
  output: {
    compact: env === EEnvironment.PRODUCTION,
    file: path.resolve(PORTABLE_ROOT, "dreamstate.js"),
    preserveModules: false,
    sourcemap: true,
    format: "es"
  },
  plugins: [
    commonjs(),
    babel({ ...BABEL_CONFIG, babelHelpers: "bundled" }),
    replace({
      preventAssignment: true,
      IS_DEV: env !== EEnvironment.PRODUCTION
    }),
    typescript({
      tsconfig: TS_PORTABLE_CONFIG,
      declaration: false
    }),
    visualizer({
      filename: path.resolve(STATS_ROOT, "ptb-stats.html"),
      gzipSize: true,
      projectRoot: DS_ROOT
    }),
    clear({
      targets: [ PORTABLE_ROOT ]
    })
  ]
});

const createPortableDtsConfig = (env) => ({
  input: [ PORTABLE_ENTRY ],
  output: {
    file: path.resolve(PORTABLE_ROOT, "dreamstate.d.ts"),
    format: "es"
  },
  plugins: [
    dts.default({
      compilerOptions: {
        baseUrl: tsconfig.compilerOptions.baseUrl,
        paths: tsconfig.compilerOptions.paths,
        rootDir: tsconfig.compilerOptions.rootDir
      }
    })
  ]
});

export default [ createPortableDtsConfig(EEnvironment.PRODUCTION), createPortableConfig(EEnvironment.PRODUCTION) ];
