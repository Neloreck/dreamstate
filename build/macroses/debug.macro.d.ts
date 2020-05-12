export interface ILogger {
  info(...args: Array<any>): void;
  error(...args: Array<any>): void;
  warn(...args: Array<any>): void;
  debug(...args: Array<any>): void;
}

export const debug: ILogger;
