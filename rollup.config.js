import * as path from "path";

import { default as babel } from "rollup-plugin-babel";
import { default as typescript } from "@rollup/plugin-typescript";
import { default as replace } from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";
import { default as visualizer } from 'rollup-plugin-visualizer';
import { default as commonjs } from 'rollup-plugin-commonjs';
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';
const IS_DEBUG = ENV === 'debug';

const PARCEL_CONFIG =  {
  external: [ "react", "shallow-equal", "hoist-non-react-statics", "preval.macro" ],
  input: "./src/index.ts",
  output: {
    compact: IS_PRODUCTION,
    file: `./lib/dreamstate.${ENV}.js`,
    name: `dreamstate.${ENV}.js`,
    sourcemap: true,
    format: "cjs"
  },
  plugins: [
    commonjs(),
    babel({
      extensions: [ ".ts", ".js" ]
    }),
    replace({
      IS_DEV: !IS_PRODUCTION,
      IS_DEBUG: IS_DEBUG
    }),
    typescript({
      tsconfig: path.resolve(__dirname, "./tsconfig.json"),
      declaration: false
    }),
    sizeSnapshot(),
    visualizer({
      filename: `target/report/stats.${ENV}.html`
    }),
  ]
};

if (IS_PRODUCTION) {
  PARCEL_CONFIG.plugins.push(
    terser({
      output: {
        beautify: false,
        comments: false
      },
    })
  );
}

export default PARCEL_CONFIG;
