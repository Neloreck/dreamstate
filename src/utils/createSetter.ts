import { TPartialTransformer } from "../types";
import { ContextManager } from "../management";

import { log } from "../../build/macroses/log.macro";

/**
 * Setter method factory.
 * !Strictly typed generic method with 'update' lifecycle.
 */
export function createSetter<S extends object, D extends keyof S>(manager: ContextManager<S>, key: D) {
  log.info("Created context setter for:", manager.constructor.name, key);

  return (next: Partial<S[D]> | TPartialTransformer<S[D]>): void => {
    return manager.setContext({
      [key]: Object.assign(
        {},
        manager.context[key],
        typeof next === "function" ? next(manager.context[key]) : next)
    } as any);
  };
}
