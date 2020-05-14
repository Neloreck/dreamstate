import * as path from "path";
import * as react from "react";

import { default as typescript } from "@rollup/plugin-typescript";
import { default as replace } from "@rollup/plugin-replace";
import { default as babel } from "rollup-plugin-babel";
import { default as commonjs } from "rollup-plugin-commonjs";
import { default as dts } from "rollup-plugin-dts";
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

import { IS_PRODUCTION, IS_DEBUG } from "./build.config";
import { BABEL_CONFIG } from "./babel.modern.config";
import { default as tsconfig } from "../../tsconfig.json";

export const ESM_CONFIG = {
  external: [ "react", "shallow-equal", "hoist-non-react-statics" ],
  input: "./src/index.ts",
  preserveModules: false,
  output: {
    compact: IS_PRODUCTION,
    file: "./portable/dreamstate.js",
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
    }),
    sizeSnapshot({ snapshotPath: "./cli/build/size_snapshot.json" })
  ]
};

export const DTS_CONFIG = {
  input: [
    "./src/index.ts"
  ],
  output: {
    file: "./portable/dreamstate.d.ts",
    format: "es"
  },
  plugins: [
    dts({
      compilerOptions: tsconfig.compilerOptions
    })
  ]
};

export default [ DTS_CONFIG, ESM_CONFIG ];
