import { default as replace } from "@rollup/plugin-replace";
import { default as typescript } from "@rollup/plugin-typescript";
import * as react from "react";
import { default as babel } from "rollup-plugin-babel";
import { default as commonjs } from "rollup-plugin-commonjs";
import { terser } from "rollup-plugin-terser";

import { BABEL_CONFIG } from "./babel.modern.config";
import { IS_PRODUCTION, IS_DEBUG, CORE_ENTRY, TEST_UTILS_ENTRY, PROJECT_ROOT, TS_BUILD_CONFIG } from "./build.config";

export const CJS_CONFIG = {
  external: [ "react", "shallow-equal", "hoist-non-react-statics", "tslib" ],
  input: [
    CORE_ENTRY,
    TEST_UTILS_ENTRY
  ],
  output: {
    chunkFileNames: "cjs/core.js",
    compact: IS_PRODUCTION,
    dir: PROJECT_ROOT,
    sourcemap: true,
    format: "cjs"
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
