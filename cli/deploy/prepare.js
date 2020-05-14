import * as fs from "fs";
import * as path from "path";

import { CJS_ROOT, DIST_ROOT, ESM_ROOT, PKG_ROOT, PROJECT_ROOT, TYPES_ROOT } from "../config/build.constants";

// eslint-disable-next-line @typescript-eslint/no-var-requires
const ncp = require("ncp");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const rimraf = require("rimraf");

const ASSETS = {
  LICENSE: {
    source: path.resolve(PROJECT_ROOT, "LICENSE"),
    destination: path.resolve(PKG_ROOT, "./LICENSE")
  },
  README: {
    source: path.resolve(PROJECT_ROOT, "README.md"),
    destination: path.resolve(PKG_ROOT, "./README.md")
  },
  CHANGELOG: {
    source: path.resolve(PROJECT_ROOT, "CHANGELOG.md"),
    destination: path.resolve(PKG_ROOT, "./CHANGELOG.md")
  },
  PACKAGE: {
    source: path.resolve(__dirname, "./dreamstate.json"),
    destination: path.resolve(PKG_ROOT, "./package.json")
  },
  ESM: {
    source: ESM_ROOT,
    destination: path.resolve(PKG_ROOT, "./esm")
  },
  CJS: CJS_ROOT,
  TYPES: TYPES_ROOT
};

if (!fs.existsSync(DIST_ROOT) || !fs.existsSync(ESM_ROOT) || !fs.existsSync(CJS_ROOT) || !fs.existsSync(TYPES_ROOT)) {
  throw new Error("Seems like build script was not called before pkg preparation.");
}

rimraf.sync(PKG_ROOT);

fs.mkdirSync(PKG_ROOT);

ncp(ASSETS.LICENSE.source, ASSETS.LICENSE.destination);
ncp(ASSETS.README.source, ASSETS.README.destination);
ncp(ASSETS.CHANGELOG.source, ASSETS.CHANGELOG.destination);
ncp(ASSETS.PACKAGE.source, ASSETS.PACKAGE.destination);
ncp(ASSETS.ESM.source, ASSETS.ESM.destination);

fs.readdirSync(CJS_ROOT).forEach((it) => ncp(path.resolve(CJS_ROOT, it), path.resolve(PKG_ROOT, it)));
fs.readdirSync(TYPES_ROOT).forEach((it) => ncp(path.resolve(TYPES_ROOT, it), path.resolve(PKG_ROOT, it)));
