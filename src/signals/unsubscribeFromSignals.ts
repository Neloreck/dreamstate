import { TSignalListener } from "@Lib/types";
import { SIGNAL_LISTENERS_REGISTRY } from "@Lib/internals";

import { debug } from "@Macro/debug.macro";

/**
 * Unsubscribe from all signals and listen everything.
 * Not intended to be used as core feature, just for some elegant decisions.
 */
export function unsubscribeFromSignals(listener: TSignalListener<any, any>): void {
  debug.info("Unsubscribe from signals api:", SIGNAL_LISTENERS_REGISTRY.size - 1);

  SIGNAL_LISTENERS_REGISTRY.delete(listener);
}
