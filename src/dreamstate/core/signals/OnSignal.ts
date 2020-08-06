import { CONTEXT_SIGNAL_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { createMethodDecorator } from "@/dreamstate/polyfills/createMethodDecorator";
import { TAnyContextManagerConstructor, TDreamstateService, TSignalType } from "@/dreamstate/types";

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

    if (!CONTEXT_SIGNAL_METADATA_REGISTRY.has(Service)) {
      CONTEXT_SIGNAL_METADATA_REGISTRY.set(Service, []);
    }

    CONTEXT_SIGNAL_METADATA_REGISTRY.get(Service)!.push([ method, signalType ]);
  });
}
