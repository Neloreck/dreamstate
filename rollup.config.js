import * as path from "path";
import { default as babel } from "rollup-plugin-babel";
import { default as typescript } from "@rollup/plugin-typescript";
import { default as replace } from '@rollup/plugin-replace';
import { terser } from "rollup-plugin-terser";

import * as babelConfig from "./babel.config.json";

const ENV = process.env.NODE_ENV || 'development';
const IS_DEV = process.env.NODE_ENV === 'development';

export default {
  external: [ "react", "shallow-equal", "hoist-non-react-statics" ],
  input: "./src/index.ts",
  output: {
    compact: !IS_DEV,
    file: `./lib/dreamstate.${ENV}.js`,
    name: `dreamstate.${ENV}.js`,
    sourcemap: true,
    format: "cjs",
    plugins: IS_DEV
      ? []
      :
      [
        terser({
          output: {
            beautify: false,
            comments: false
          },
        })
      ]
  },
  plugins: [
    babel(babelConfig),
    replace({ IS_DEV: IS_DEV }),
    typescript({
      tsconfig: path.resolve(__dirname, "./tsconfig.json"),
      declaration: false
    }),
  ]
}
