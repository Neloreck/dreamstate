import * as fs from "fs";
import * as path from "path";

import ncp from "ncp";
import * as rimraf from "rimraf";

import { CJS_ROOT, DIST_ROOT, ESM_ROOT, PKG_ROOT, PROJECT_ROOT, SRC_PATH, TYPES_ROOT } from "../config/build.constants";

interface IAssetsDescription {
  [index: string]: {
    source: string;
    destination: string;
  };
}

const ASSETS: IAssetsDescription = {
  LICENSE: {
    source: path.resolve(PROJECT_ROOT, "LICENSE"),
    destination: path.resolve(PKG_ROOT, "LICENSE")
  },
  README: {
    source: path.resolve(PROJECT_ROOT, "README.md"),
    destination: path.resolve(PKG_ROOT, "README.md")
  },
  CHANGELOG: {
    source: path.resolve(PROJECT_ROOT, "CHANGELOG.md"),
    destination: path.resolve(PKG_ROOT, "CHANGELOG.md")
  },
  PACKAGE: {
    source: path.resolve(SRC_PATH, "dreamstate/package.json"),
    destination: path.resolve(PKG_ROOT, "package.json")
  },
  ESM: {
    source: ESM_ROOT,
    destination: path.resolve(PKG_ROOT, "esm")
  },
  CJS: {
    source: CJS_ROOT,
    destination: path.resolve(PKG_ROOT, "cjs")
  },
  // Types.
  ...fs.readdirSync(TYPES_ROOT).reduce((acc: IAssetsDescription, it: string) => {
    acc["TYPES#" + it] = {
      source: path.resolve(TYPES_ROOT, it),
      destination: path.resolve(PKG_ROOT, it)
    };

    return acc;
  }, {})
};

const SWITCHERS: IAssetsDescription = {
  ESM_SWITCH: {
    source: path.resolve(SRC_PATH, "environment_switch/esm.js"),
    destination: path.resolve(PKG_ROOT, "esm/index.js")
  },
  CJS_CORE_SWITCH: {
    source: path.resolve(SRC_PATH, "environment_switch/cjs_core.js"),
    destination: path.resolve(PKG_ROOT, "index.js")
  },
  CJS_UTILS_SWITCH: {
    source: path.resolve(SRC_PATH, "environment_switch/cjs_utils.js"),
    destination: path.resolve(PKG_ROOT, "test-utils.js")
  }
};

if (!fs.existsSync(DIST_ROOT) || !fs.existsSync(ESM_ROOT) || !fs.existsSync(CJS_ROOT) || !fs.existsSync(TYPES_ROOT)) {
  throw new Error("Seems like build script was not called before pkg preparation.");
}

rimraf.sync(PKG_ROOT);

fs.mkdirSync(PKG_ROOT);

Object.values(ASSETS).forEach((it) => ncp(it.source, it.destination, () => {}));
Object.values(SWITCHERS).forEach((it) => ncp(it.source, it.destination, () => {}));
