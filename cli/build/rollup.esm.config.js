import * as path from "path";
import * as react from "react";

import { default as typescript } from "@rollup/plugin-typescript";
import { default as replace } from "@rollup/plugin-replace";
import { default as babel } from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import { default as commonjs } from "rollup-plugin-commonjs";

import { BABEL_CONFIG } from "./babel.modern.config";
import { PROJECT_ROOT, IS_PRODUCTION, IS_DEBUG } from "./build.config";

export const ESM_CONFIG = {
  external: [ "react", "shallow-equal", "hoist-non-react-statics", "tslib" ],
  input: path.resolve(PROJECT_ROOT, "./src/index.ts"),
  preserveModules: true,
  output: {
    compact: IS_PRODUCTION,
    dir: path.resolve(PROJECT_ROOT, "./esm/"),
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
      tsconfig: path.resolve(__dirname, "./tsconfig.build.json"),
      pretty: !IS_PRODUCTION,
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

export default ESM_CONFIG;
