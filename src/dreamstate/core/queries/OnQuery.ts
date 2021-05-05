import { QUERY_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import { createMethodDecorator } from "@/dreamstate/polyfills/createMethodDecorator";
import { TAnyContextManagerConstructor, TQueryType } from "@/dreamstate/types";

/**
 * Decorator that binds specific method as query handler.
 */
export function OnQuery(
  queryType: TQueryType
): MethodDecorator {
  if (!queryType) {
    throw new TypeError("Query type should be provided for OnQuery decorator.");
  }

  return createMethodDecorator<TAnyContextManagerConstructor>(function rememberMethodQuery(
    method: string | symbol,
    Service: TAnyContextManagerConstructor
  ): void {
    if (!(Service.prototype instanceof ContextManager)) {
      throw new TypeError("Only ContextManager extending classes methods can be decorated as handlers.");
    }

    Service[QUERY_METADATA_SYMBOL].push([ method, queryType ]);
  });
}
