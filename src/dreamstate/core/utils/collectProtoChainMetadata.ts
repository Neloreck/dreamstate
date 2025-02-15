import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  EDreamstateErrorCode,
  TAnyContextManagerConstructor,
  TAnyValue,
  TContextManagerMetadata,
} from "@/dreamstate/types";

/**
 * Collects metadata from the prototype chain of a given context manager class.
 *
 * This function resolves issues related to class inheritance, particularly when dealing with query
 * and signal handlers. It traverses the prototype chain of the provided context manager class,
 * gathering metadata and ensuring all inherited behaviors are properly registered.
 *
 * @template T - The type of the context manager constructor.
 * @template D - The type of the metadata stored in the registry.
 * @param {T} target - The base context manager class from which metadata should be collected.
 * @param {WeakMap<T, D>} registry - A weak map registry that holds metadata for context manager classes.
 * @returns {D} The collected metadata for the given context manager.
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
    return metadata.reduce(
      function(pr: D, it: D) {
        if (it) {
          return pr.concat(it as TAnyValue) as D;
        } else {
          return pr;
        }
      },
      [] as unknown as D
    );
  } else {
    throw new DreamstateError(
      EDreamstateErrorCode.INCORRECT_PARAMETER,
      "Failed to collect metadata of class that is not extending ContextManager."
    );
  }
}
