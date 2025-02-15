import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { QUERY_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/management/ContextManager";
import { EDreamstateErrorCode, TAnyContextManagerConstructor, TQueryType } from "@/dreamstate/types";
import { createMethodDecorator } from "@/dreamstate/utils/polyfills/createMethodDecorator";
import { isCorrectQueryType } from "@/dreamstate/utils/typechecking";

/**
 * Class method decorator factory that marks the decorated method as a handler for specified query types.
 *
 * This decorator ensures that the decorated method will be invoked when a query of the specified type(s)
 * is triggered within the current scope. It supports handling a single query type or an array of query types.
 * The supported query types include `string`, `number`, and `symbol`.
 *
 * @param {TQueryType | Array<TQueryType>} queryType - The query type or an array of query types
 *   that the decorated method will handle.
 * @returns {MethodDecorator} A method decorator that attaches the query handler functionality to the method.
 */
export function OnQuery(queryType: TQueryType): MethodDecorator {
  if (!isCorrectQueryType(queryType)) {
    throw new DreamstateError(EDreamstateErrorCode.INCORRECT_QUERY_TYPE, typeof queryType);
  }

  /*
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
      QUERY_METADATA_REGISTRY.get(ManagerClass)!.push([method, queryType]);
    } else {
      QUERY_METADATA_REGISTRY.set(ManagerClass, [[method, queryType]]);
    }
  });
}
