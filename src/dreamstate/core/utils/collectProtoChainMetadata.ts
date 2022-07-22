import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { EDreamstateErrorCode, TAnyContextManagerConstructor, TContextManagerMetadata } from "@/dreamstate/types";

/**
 * Collect metadata of prototype chain for provided context manager.
 * Solves problems with class extension + query/signal handlers.
 *
 * @param target - metadata collection target, base context manager class for data collection.
 * @param registry - current registry of metadata to collect information.
 *
 * @returns collected metadata array.
 */
export function collectProtoChainMetadata<T extends TAnyContextManagerConstructor, D extends TContextManagerMetadata>(
  target: T,
  registry: WeakMap<T, D>
): D {
  if (target.prototype instanceof ContextManager) {
    const metadata: Array<D> = [];
    let current: T = target;

    while (current !== (ContextManager as unknown)) {
      metadata.push(registry.get(current) as D);
      current = Object.getPrototypeOf(current);
    }

    /**
     * todo: Remove duplicates from an array?
     * todo: If overriding signal handling methods and adding @OnSignal, it may cause issues with double call of method.
     */
    return metadata.reduce(function(pr: D, it: D) {
      if (it) {
        return pr.concat(it as any) as D;
      } else {
        return pr;
      }
    }, [] as unknown as D);
  } else {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      "Failed to collect metadata of class that is not extending ContextManager."
    );
  }
}
