import * as path from "path";
import { default as babel } from "rollup-plugin-babel";
import { default as typescript } from "@rollup/plugin-typescript";
import { terser } from "rollup-plugin-terser";

import * as babelConfig from "./babel.config.json";

const createTerserConfig = (isDev) => ({
  output: {
    beautify: false,
    comments: false
  },
  compress: {
    global_defs: {
      IS_DEV: isDev
    }
  }
});

export default {
  external: [ "react", "shallow-equal", "hoist-non-react-statics" ],
  input: "./src/index.ts",
  output: [
    {
      compact: true,
      file: "./lib/dreamstate.production.js",
      name: "dreamstate.production.js",
      sourcemap: true,
      format: "cjs",
      plugins: [
        terser(createTerserConfig(false))
      ]
    },
    {
      file: "./lib/dreamstate.development.js",
      name: "dreamstate.development.js",
      sourcemap: true,
      format: "cjs",
      plugins: [
        terser(createTerserConfig(false))
      ]
    },
  ],
  plugins: [
    babel(babelConfig),
    typescript({
      tsconfig: path.resolve(__dirname, "./tsconfig.json"),
      declaration: false
    }),
  ]
}
