import { TAnyValue } from "@/dreamstate/types";

export interface ILogger {
  info(...args: Array<TAnyValue>): void;

  error(...args: Array<TAnyValue>): void;

  warn(...args: Array<TAnyValue>): void;

  debug(...args: Array<TAnyValue>): void;
}

export const log: ILogger;
