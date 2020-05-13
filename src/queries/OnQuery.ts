import { TAnyContextManagerConstructor, TDreamstateService, TQueryType } from "../types";
import { CONTEXT_QUERY_METADATA_REGISTRY } from "../internals";
import { createMethodDecorator } from "../polyfills/createMethodDecorator";
import { ContextService } from "../management/ContextService";

import { debug } from "../../cli/build/macroses/debug.macro";

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

    debug.info("Query metadata written for context manager:", Service.name, queryType, method);

    if (!CONTEXT_QUERY_METADATA_REGISTRY.has(Service)) {
      CONTEXT_QUERY_METADATA_REGISTRY.set(Service, []);
    }

    CONTEXT_QUERY_METADATA_REGISTRY.get(Service)!.push([ method, queryType ]);
  });
}
