import { QUERY_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { TAnyContextManagerConstructor, TQueryType } from "@/dreamstate/types";
import { createMethodDecorator } from "@/dreamstate/utils/polyfills/createMethodDecorator";

/**
 * Class method decorator.
 * Marks decorated method as handler of provided type(s) queries.
 * All queries in current scope with specified type will be handled by callback.
 *
 * @param {(TQueryType|Array.<TQueryType>>)} queryType - signal or array of signals that should be handled.
 */
export function OnQuery(queryType: TQueryType): MethodDecorator {
  if (!queryType) {
    throw new TypeError("Query type should be provided for OnQuery decorator.");
  }

  /**
   * Support old and new decorators with polyfill.
   */
  return createMethodDecorator<TAnyContextManagerConstructor>(function(
    method: string | symbol,
    ManagerClass: TAnyContextManagerConstructor
  ): void {
    if (!(ManagerClass.prototype instanceof ContextManager)) {
      throw new TypeError("Only ContextManager extending classes methods can be decorated as query handlers.");
    }

    if (QUERY_METADATA_REGISTRY.has(ManagerClass)) {
      QUERY_METADATA_REGISTRY.get(ManagerClass)!.push([ method, queryType ]);
    } else {
      QUERY_METADATA_REGISTRY.set(ManagerClass, [ [ method, queryType ] ]);
    }
  });
}
