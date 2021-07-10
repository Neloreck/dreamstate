import * as path from "path";

export const EEnvironment = {
  PRODUCTION: "production",
  DEVELOPMENT: "development"
};

export const ENV = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = ENV === "production";

export const PROJECT_ROOT = path.resolve(__dirname, "../..");
export const DS_ROOT = path.resolve(PROJECT_ROOT, "./src/dreamstate");
export const TARGET_ROOT = path.resolve(PROJECT_ROOT, "./target");
export const PKG_ROOT = path.resolve(TARGET_ROOT, "./pkg");

export const DIST_ROOT = path.resolve(TARGET_ROOT, "./dist");
export const ESM_ROOT = path.resolve(DIST_ROOT, "./esm");
export const PORTABLE_ROOT = path.resolve(DIST_ROOT, "./portable");
export const CJS_ROOT = path.resolve(DIST_ROOT, "./cjs");
export const TYPES_ROOT = path.resolve(DIST_ROOT, "./dts");
export const STATS_ROOT = path.resolve(DIST_ROOT, "./stats");

export const TS_GLOBAL_CONFIG = path.resolve(PROJECT_ROOT, "./tsconfig.json");
export const TS_BUILD_CONFIG = path.resolve(__dirname, "./tsconfig.build.json");
export const TS_PORTABLE_CONFIG = path.resolve(__dirname, "./tsconfig.portable.json");

export const CORE_ENTRY = path.resolve(DS_ROOT, "./index.ts");
export const PORTABLE_ENTRY = path.resolve(PROJECT_ROOT, "./src/environment_switch/portable.ts");
export const TEST_UTILS_ENTRY = path.resolve(DS_ROOT, "./test-utils.ts");

export const SRC_PATH = path.resolve(PROJECT_ROOT, "./src");

export const SIZE_SNAPSHOT_PATH = path.resolve(__dirname, "size_snapshot.json");
