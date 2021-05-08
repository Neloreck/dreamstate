import { Suite } from "benchmark";

export const suite = new Suite()
  .add("error_without_check", () => {
    const value: Record<string, any> = null as any;

    try {
      Object.keys(value);
    } catch {
      // Empty.
    }
  })
  .add("error_with_check", () => {
    const value: Record<string, any> = null as any;

    try {
      if (typeof value !== "object" || !value) {
        throw new TypeError("Generic error.");
      }

      Object.keys(value);
    } catch {
      // Empty.
    }
  })
  .add("without_error_without_check", () => {
    const value: Record<string, any> = {};

    try {
      return Object.keys(value);
    } catch {
      // Empty.
    }
  })
  .add("without_error_with_check", () => {
    const value: Record<string, any> = {};

    try {
      if (typeof value !== "object" || !value) {
        throw new TypeError("Generic error.");
      }

      return Object.keys(value);
    } catch {
      // Empty.
    }
  });
