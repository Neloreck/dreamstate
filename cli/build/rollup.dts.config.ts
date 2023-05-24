import { default as clear } from "rollup-plugin-clear";
import { default as dts } from "rollup-plugin-dts";

import { default as tsconfig } from "../../tsconfig.json";
import { CORE_ENTRY, TEST_UTILS_ENTRY, TYPES_ROOT } from "../config/build.constants";

export const DTS_CONFIG = {
  input: [ CORE_ENTRY, TEST_UTILS_ENTRY ],
  output: {
    chunkFileNames: "lib",
    dir: TYPES_ROOT,
    format: "es"
  },
  plugins: [
    dts({
      compilerOptions: {
        baseUrl: tsconfig.compilerOptions.baseUrl,
        paths: tsconfig.compilerOptions.paths,
        rootDir: tsconfig.compilerOptions.rootDir
      }
    }),
    clear({
      targets: [ TYPES_ROOT ]
    })
  ]
};

export default [ DTS_CONFIG ];
