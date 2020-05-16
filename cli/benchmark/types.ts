export interface ISuiteResult {
  name: string;
  period: number;
  frequency: number;
  k: number;
}

export interface IBenchmarkResult {
  name: string;
  lastRun: number;
  fastest: string;
  suites: Array<ISuiteResult>;
}

export interface IBenchmarkResults {
  lastRun: number;
  benchmarks: {
    [index: string]: IBenchmarkResult;
  };
}
