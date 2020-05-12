import { TSignalListener } from "../types";
import { SIGNAL_LISTENERS_REGISTRY } from "../internals";

import { debug } from "../../build/macroses/debug.macro";

/**
 * Subscribe to all signals and listen everything.
 * Should be filtered by users like redux does.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function subscribeToSignals(listener: TSignalListener<any, any>): void {
  debug.info("Subscribe to signals api:", SIGNAL_LISTENERS_REGISTRY.size + 1);

  SIGNAL_LISTENERS_REGISTRY.add(listener);
}
