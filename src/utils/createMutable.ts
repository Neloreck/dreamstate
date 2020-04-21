import { TMutable } from "../types";
import { NESTED_STORE_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Util for mutable.
 */
function asMerged<T extends object>(this: TMutable<T>, state: Partial<T>): T {
  return Object.assign({}, this as TMutable<T>, state);
}

/**
 * Create mutable sub-state.
 */
export function createMutable<T extends object>(initialValue: T): TMutable<T> {
  log.info("Created mutable entity from:", initialValue);

  return Object.assign(
    {},
    initialValue,
    {
      [NESTED_STORE_KEY]: true,
      asMerged: asMerged as any
    }
  );
}
