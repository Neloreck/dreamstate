import { TAnyContextManagerConstructor, TConstructorKey, TSignalType } from "../types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "../internals";
import { createMethodDecorator } from "../polyfills/createMethodDecorator";

import { log } from "../../build/macroses/log.macro";
import { ContextWorker } from "@Lib/management";

/**
 * Write signal filter and bound method to class metadata.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  if (!signalType) {
    throw new TypeError("Signal type should be provided for OnQuery decorator.");
  }

  return createMethodDecorator<TAnyContextManagerConstructor>(function (
    method: string | symbol,
    managerConstructor: TAnyContextManagerConstructor
  ): void {
    if (!(managerConstructor.prototype instanceof ContextWorker)) {
      throw new TypeError("Only ContextWorker extending classes methods can be decorated as handlers.");
    }

    log.info("Signal metadata written for context manager:", managerConstructor.name, signalType, method);

    if (!CONTEXT_SIGNAL_METADATA_REGISTRY.has(managerConstructor)) {
      CONTEXT_SIGNAL_METADATA_REGISTRY.set(managerConstructor as TConstructorKey, []);
    }

    CONTEXT_SIGNAL_METADATA_REGISTRY.get(managerConstructor)!.push([ method, signalType ]);
  });
}
