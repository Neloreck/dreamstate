import { TAnyContextManagerConstructor } from "@/dreamstate/types";

/**
 * Mock manager initial context on service registration.
 * Packs manager and context in map in a type-safe way instead of manual way.
 *
 * @param ManagerClass - manager class to provide initial context to.
 * @param context - initial context partial for applying on provision.
 */
export function mockManagerInitialContext<D extends TAnyContextManagerConstructor>(
  ManagerClass: D,
  context: Partial<D["prototype"]["context"]>
): [D, Partial<D["prototype"]["context"]>] {
  return [ ManagerClass, context ];
}
