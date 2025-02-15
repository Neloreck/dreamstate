import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Mocks the initial context of a manager during service registration.
 * This method ensures type safety by packaging the manager and its initial context in a structured way.
 *
 * @template D - The type of the context manager constructor.
 * @param {D} ManagerClass - The manager class to which the initial context should be applied.
 * @param {Partial<D["prototype"]["context"]>} context - A partial initial context to be used during provision.
 * @returns {[D, Partial<D["prototype"]["context"]>]} A tuple containing the manager class and the provided
 *   initial context.
 */
export function mockManagerInitialContext<D extends TAnyContextManagerConstructor>(
  ManagerClass: D,
  context: Partial<D["prototype"]["context"]>
): [D, Partial<D["prototype"]["context"]>] {
  return [ManagerClass, context];
}
