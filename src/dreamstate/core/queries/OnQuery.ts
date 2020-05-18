import { CONTEXT_QUERY_METADATA_REGISTRY } from "@/dreamstate/core/internals";
import { ContextService } from "@/dreamstate/core/services/ContextService";
import { createMethodDecorator } from "@/dreamstate/polyfills/createMethodDecorator";
import { TAnyContextManagerConstructor, TDreamstateService, TQueryType } from "@/dreamstate/types";

export function OnQuery(queryType: TQueryType): MethodDecorator {
  if (!queryType) {
    throw new TypeError("Query type should be provided for OnQuery decorator.");
  }

  return createMethodDecorator<TAnyContextManagerConstructor>(function rememberMethodQuery(
    method: string | symbol,
    Service: TDreamstateService
  ): void {
    if (!(Service.prototype instanceof ContextService)) {
      throw new TypeError("Only ContextService extending classes methods can be decorated as handlers.");
    }

    if (!CONTEXT_QUERY_METADATA_REGISTRY.has(Service)) {
      CONTEXT_QUERY_METADATA_REGISTRY.set(Service, []);
    }

    CONTEXT_QUERY_METADATA_REGISTRY.get(Service)!.push([ method, queryType ]);
  });
}
