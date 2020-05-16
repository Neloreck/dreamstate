import * as path from "path";

import { BENCHMARKS_PATH } from "../config/build.constants";

const targetScript: string | undefined = process.argv[2];
const targetScriptPath: string | undefined = path.resolve(BENCHMARKS_PATH, targetScript);

try {
  process.stdout.write(`Running benchmark script, target: '${targetScript}'.\n`);

  const suite = require(targetScriptPath).suite;

  process.stdout.write(`Found benchmark, running: '${targetScriptPath}'.\n`);

  suite.run({ "async": false });

  // todo: File saving, report.

  process.stdout.write("Benchmark run success.\n");
} catch (error) {
  process.stderr.write(`Failed to run benchmark: '${error.message}'.`);
}
