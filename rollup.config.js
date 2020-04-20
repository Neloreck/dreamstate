import * as path from "path";
import * as react from 'react';

import { default as typescript } from "@rollup/plugin-typescript";
import { default as replace } from '@rollup/plugin-replace';
import { default as resolve } from '@rollup/plugin-node-resolve';
import { default as babel } from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import { default as commonjs } from 'rollup-plugin-commonjs';
import { sizeSnapshot } from "rollup-plugin-size-snapshot";

const ENV = process.env.NODE_ENV || 'development';
const IS_PRODUCTION = ENV === 'production';
const IS_DEBUG = ENV === 'debug';

const createBaseConfig = () => ({
  input: "./src/index.ts",
  plugins: [
    commonjs({
      namedExports: {
        react: Object.keys(react)
      },
    }),
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
    sizeSnapshot()
  ]
});

const createCjsConfig = () => {
  const config = createBaseConfig();

  config.external = [ "react", "shallow-equal", "hoist-non-react-statics" ];

  config.output = {
    compact: IS_PRODUCTION,
    file: `./cjs/dreamstate.${ENV}.js`,
    name: `dreamstate.${ENV}.js`,
    sourcemap: true,
    format: "cjs"
  };

  if (IS_PRODUCTION) {
    config.plugins.push(
      terser({
        output: {
          beautify: false,
          comments: false
        },
      })
    );
  }

  return config;
};

const createBrowserConfig = () => {
  const config = createBaseConfig();

  config.external = [ "react" ];

  config.output = ([
    {
      compact: IS_PRODUCTION,
      file: `./umd/dreamstate.${ENV}.js`,
      name: `dreamstate.${ENV}.js`,
      sourcemap: true,
      format: "umd",
      globals: {
        'react': 'React',
      },
    },
    {
      compact: IS_PRODUCTION,
      file: `./es/dreamstate.${ENV}.js`,
      name: `dreamstate.${ENV}.js`,
      sourcemap: true,
      format: "es",
      globals: {
        'react': 'React',
      },
    }
  ]);

  config.plugins = [
    resolve({
      browser: true
    })
  ].concat(config.plugins);

  if (IS_PRODUCTION) {
    config.plugins.push(
      terser({
        output: {
          beautify: false,
          comments: false
        },
      })
    );
  }

  return config;
};

// export default createCjsConfig();
export default [ createCjsConfig(), createBrowserConfig() ];
