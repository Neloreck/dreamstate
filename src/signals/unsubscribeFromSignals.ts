import { TSignalListener, TSignalType } from "../types";
import { SIGNAL_LISTENERS_REGISTRY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Unsubscribe from all signals and listen everything.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unsubscribeFromSignals(listener: TSignalListener<TSignalType, any>): void {
  log.info("Unsubscribe from signals api:", SIGNAL_LISTENERS_REGISTRY.size - 1);

  SIGNAL_LISTENERS_REGISTRY.delete(listener);
}
