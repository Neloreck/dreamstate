import * as path from "path";

import { default as replace } from "@rollup/plugin-replace";
import { default as typescript } from "@rollup/plugin-typescript";
import * as react from "react";
import { default as babel } from "rollup-plugin-babel";
import { default as commonjs } from "rollup-plugin-commonjs";
import { default as dts } from "rollup-plugin-dts";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

import { default as tsconfig } from "../../tsconfig.json";
import {
  CORE_ENTRY,
  TS_PORTABLE_CONFIG,
  SIZE_SNAPSHOT_PATH,
  PORTABLE_ROOT, EEnvironment
} from "../config/build.constants";

import { BABEL_CONFIG } from "./babel.modern.config";

const createPortableConfig = (env) => ({
  external: [
    "react",
    "shallow-equal",
    "hoist-non-react-statics"
  ],
  input: CORE_ENTRY,
  preserveModules: false,
  output: {
    compact: env === EEnvironment.PRODUCTION,
    file: path.resolve(PORTABLE_ROOT, "dreamstate.js"),
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
      IS_DEV: env !== EEnvironment.PRODUCTION
    }),
    typescript({
      tsconfig: TS_PORTABLE_CONFIG,
      declaration: false
    }),
    sizeSnapshot({ snapshotPath: SIZE_SNAPSHOT_PATH })
  ]
});

const createPortableDtsConfig = (env) => ({
  input: [
    CORE_ENTRY
  ],
  output: {
    file: path.resolve(PORTABLE_ROOT, "dreamstate.d.ts"),
    format: "es"
  },
  plugins: [
    dts({ compilerOptions: tsconfig.compilerOptions })
  ]
});

export default [ createPortableDtsConfig(EEnvironment.PRODUCTION), createPortableConfig(EEnvironment.PRODUCTION) ];
