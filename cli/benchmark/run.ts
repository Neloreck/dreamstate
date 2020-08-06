import * as path from "path";

import { green } from "colors";

import { BENCHMARKS_PATH } from "../config/build.constants";

import { printSuiteResults, saveResults } from "./utils";

const targetScript: string | undefined = process.argv[2];
const targetScriptPath: string | undefined = path.resolve(BENCHMARKS_PATH, "./suites", targetScript);

process.stdout.write(`Running benchmark script, target: '${green(targetScript)}'.\n`);

import(targetScriptPath)
  .then(({ suite }) => {
    process.stdout.write(`Found benchmark, running: '${green(targetScriptPath)}'.\n\n`);

    suite.run({ "async": false });

    printSuiteResults(suite);

    process.stdout.write("Benchmark run success, saving results.\n");

    saveResults(targetScript, suite);

    process.stdout.write("Results saved.\n");
  })
  .catch((error) => {
    process.stderr.write(`Failed to run benchmark: '${error.message}'.\n`);
  });
