import * as fs from "fs";
import * as path from "path";

import { Suite } from "benchmark";
import { green } from "colors";

import { BENCHMARKS_PATH } from "../config/build.constants";

import { IBenchmarkResults } from "./types";

const resultsPath: string = path.resolve(BENCHMARKS_PATH, "./results.json");

export function saveResults(target: string, suite: Suite): void {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const results: IBenchmarkResults = require(resultsPath);
  const fastest = (suite.filter("fastest") as any)[0];
  const now: number = Date.now();

  results.lastRun = now;
  results.benchmarks[target] = {
    name: target,
    lastRun: now,
    fastest: fastest.name,
    suites: []
  };

  suite.forEach((it: any) => {
    results.benchmarks[target].suites.push({
      name: it.name,
      period: it.times.period,
      frequency: 1000 / it.times.period,
      k: it.times.period * 100 / fastest.times.period / 100
    });
  });

  fs.writeFileSync(resultsPath, JSON.stringify(results, null, "  "));
}

export function printSuiteResults(suite: Suite): void {
  const fastest = (suite.filter("fastest") as any)[0];

  suite.forEach((it: any) => {
    process.stdout.write(`${green(it.name)} x ${1000 / it.times.period} (${it.times.period}) ` +
    `k=${it.times.period * 100 / fastest.times.period / 100}\n`);
  });

  process.stdout.write(`\nFastest: ${green(suite.filter("fastest").map("name" as any)[0])}.\n`);
}
