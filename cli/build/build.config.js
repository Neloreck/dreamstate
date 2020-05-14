import * as path from "path";

export const ENV = process.env.NODE_ENV || "development";
export const IS_PRODUCTION = ENV === "production";
export const IS_DEBUG = ENV === "debug";

export const PROJECT_ROOT = path.resolve(__dirname, "../..");
