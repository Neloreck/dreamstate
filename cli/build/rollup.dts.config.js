import { default as dts } from "rollup-plugin-dts";

import { default as tsconfig } from "../../tsconfig.json";
import { CORE_ENTRY, TEST_UTILS_ENTRY, TYPES_ROOT } from "../config/build.constants";

export const DTS_CONFIG = {
  input: [
    CORE_ENTRY,
    TEST_UTILS_ENTRY
  ],
  output: {
    chunkFileNames: "lib",
    dir: TYPES_ROOT,
    format: "es"
  },
  plugins: [
    dts({ compilerOptions: tsconfig.compilerOptions })
  ]
};

export default [ DTS_CONFIG ];
