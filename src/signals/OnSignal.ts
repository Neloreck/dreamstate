import { TAnyContextManagerConstructor, TDreamstateService, TSignalType } from "@Lib/types";
import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "@Lib/internals";
import { createMethodDecorator } from "@Lib/polyfills/createMethodDecorator";
import { ContextService } from "@Lib/management/ContextService";

import { debug } from "@Macro/debug.macro";

/**
 * Write signal filter and bound method to class metadata.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  if (!signalType) {
    throw new TypeError("Signal type should be provided for OnQuery decorator.");
  }

  return createMethodDecorator<TAnyContextManagerConstructor>(function(
    method: string | symbol,
    Service: TDreamstateService
  ): void {
    if (!(Service.prototype instanceof ContextService)) {
      throw new TypeError("Only ContextService extending classes methods can be decorated as handlers.");
    }

    debug.info("Signal metadata written for context manager:", Service.name, signalType, method);

    if (!CONTEXT_SIGNAL_METADATA_REGISTRY.has(Service)) {
      CONTEXT_SIGNAL_METADATA_REGISTRY.set(Service, []);
    }

    CONTEXT_SIGNAL_METADATA_REGISTRY.get(Service)!.push([ method, signalType ]);
  });
}
