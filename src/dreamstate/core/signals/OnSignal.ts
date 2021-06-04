import { SIGNAL_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyContextManagerConstructor, TSignalType } from "@/dreamstate/types";
import { createMethodDecorator } from "@/dreamstate/utils/polyfills/createMethodDecorator";

/**
 * Class method decorator.
 * Marks decorated method as handler of provided type(s) signals.
 * All signals in current scope with specified type will be handled by callback.
 *
 * @param {(TSignalType|Array.<TSignalType>>)} signalType - signal or array of signals that should be handled.
 */
export function OnSignal(signalType: Array<TSignalType> | TSignalType): MethodDecorator {
  if (!signalType) {
    throw new TypeError("Signal type should be provided for OnQuery decorator.");
  }

  /**
   * Support old and new decorators with polyfill.
   */
  return createMethodDecorator<TAnyContextManagerConstructor>(function(
    method: string | symbol,
    ManagerClass: TAnyContextManagerConstructor
  ): void {
    if (!(ManagerClass.prototype instanceof ContextManager)) {
      throw new TypeError("Only ContextManager extending classes methods can be decorated as handlers.");
    }

    if (SIGNAL_METADATA_REGISTRY.has(ManagerClass)) {
      SIGNAL_METADATA_REGISTRY.get(ManagerClass)!.push([ method, signalType ]);
    } else {
      SIGNAL_METADATA_REGISTRY.set(ManagerClass, [ [ method, signalType ] ]);
    }
  });
}
