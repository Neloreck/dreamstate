import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyObject, TPartialTransformer } from "@/dreamstate/types";

/**
 * Setter method factory.
 * !Strictly typed generic method with 'update' lifecycle.
 *
 * todo: Deprecate or support nested stores/loadable etc.
 */
export function createSetter<S extends TAnyObject, D extends keyof S>(
  manager: ContextManager<S>,
  key: D
) {
  if (typeof manager.context[key] !== "object") {
    throw new TypeError("Cannot create setter for non-object nested properties.");
  }

  return (next: Partial<S[D]> | TPartialTransformer<S[D]>): void => {
    return manager.setContext({
      [key]: Object.assign({}, manager.context[key], typeof next === "function" ? next(manager.context[key]) : next)
    } as any);
  };
}
