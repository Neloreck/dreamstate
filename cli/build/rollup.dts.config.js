import { default as dts } from "rollup-plugin-dts";

import { default as tsconfig } from "../../tsconfig.json";

export const DTS_CONFIG = {
  input: [
    "./src/index.ts",
    "./src/test-utils.ts"
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
