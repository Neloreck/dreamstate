import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { QUERY_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { EDreamstateErrorCode, TAnyContextManagerConstructor, TQueryType } from "@/dreamstate/types";
import { createMethodDecorator } from "@/dreamstate/utils/polyfills/createMethodDecorator";
import { isCorrectQueryType } from "@/dreamstate/utils/typechecking";

/**
 * Class method decorator.
 * Marks decorated method as handler of provided type(s) queries.
 * All queries in current scope with specified type will be handled by callback.
 *
 * Correct query types: string, number, symbol.
 *
 * @param {(TQueryType|Array.<TQueryType>>)} queryType - signal or array of signals that should be handled.
 */
export function OnQuery(queryType: TQueryType): MethodDecorator {
  if (!isCorrectQueryType(queryType)) {
    throw new DreamstateError(EDreamstateErrorCode.INCORRECT_QUERY_TYPE, typeof queryType);
  }

  /**
   * Support old and new decorators with polyfill.
   */
  return createMethodDecorator<TAnyContextManagerConstructor>(function(
    method: string | symbol,
    ManagerClass: TAnyContextManagerConstructor
  ): void {
    if (!(ManagerClass.prototype instanceof ContextManager)) {
      throw new DreamstateError(
        EDreamstateErrorCode.TARGET_CONTEXT_MANAGER_EXPECTED,
        "Only ContextManager extending classes methods can be decorated as query handlers."
      );
    }

    if (QUERY_METADATA_REGISTRY.has(ManagerClass)) {
      QUERY_METADATA_REGISTRY.get(ManagerClass)!.push([ method, queryType ]);
    } else {
      QUERY_METADATA_REGISTRY.set(ManagerClass, [ [ method, queryType ] ]);
    }
  });
}
