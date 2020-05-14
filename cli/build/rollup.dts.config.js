import { default as dts } from "rollup-plugin-dts";

import { default as tsconfig } from "../../tsconfig.json";

import { CORE_ENTRY, TEST_UTILS_ENTRY } from "./build.config";

export const DTS_CONFIG = {
  input: [
    CORE_ENTRY,
    TEST_UTILS_ENTRY
  ],
  output: {
    chunkFileNames: "types/lib",
    dir: "./",
    format: "es"
  },
  plugins: [
    dts({
      compilerOptions: tsconfig.compilerOptions
    })
  ]
};

export default DTS_CONFIG;
