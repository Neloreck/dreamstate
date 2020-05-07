import { TAnyContextManagerConstructor, TConstructorKey, TSignalType } from "../types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "../internals";
import { createMethodDecorator } from "../polyfills/createMethodDecorator";

import { log } from "../../build/macroses/log.macro";

/**
 * Write signal filter and bound method to class metadata.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  return createMethodDecorator<TAnyContextManagerConstructor>(function (
    method: string | symbol,
    managerConstructor: TAnyContextManagerConstructor
  ): void {
    log.info("Signal metadata written for context manager:", managerConstructor.name, signalType, method);

    if (!CONTEXT_SIGNAL_METADATA_REGISTRY.has(managerConstructor)) {
      CONTEXT_SIGNAL_METADATA_REGISTRY.set(managerConstructor as TConstructorKey, []);
    }

    CONTEXT_SIGNAL_METADATA_REGISTRY.get(managerConstructor)!.push([ method, signalType ]);
  });
}
