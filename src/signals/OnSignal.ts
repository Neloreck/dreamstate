import { TAnyContextManagerConstructor, TSignalType } from "../types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY, IDENTIFIER_KEY } from "../internals";
import { createMethodDecorator } from "../polyfills";

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

    CONTEXT_SIGNAL_METADATA_REGISTRY[managerConstructor[IDENTIFIER_KEY]].push([ method, signalType ]);
  });
}
