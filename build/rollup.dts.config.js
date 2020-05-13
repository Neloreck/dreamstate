import { default as dts } from "rollup-plugin-dts";

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
    dts()
  ]
};

export default DTS_CONFIG;
