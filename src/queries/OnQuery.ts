import { TAnyContextManagerConstructor, TQueryType } from "../types";
import { CONTEXT_QUERY_METADATA_REGISTRY } from "../internals";
import { createMethodDecorator } from "../polyfills";
import { ContextWorker } from "../management";

import { log } from "../../build/macroses/log.macro";

export function OnQuery(queryType: TQueryType): MethodDecorator {
  if (!queryType) {
    throw new TypeError("Query type should be provided for OnQuery decorator.");
  }

  return createMethodDecorator<TAnyContextManagerConstructor>(function rememberMethodQuery(
    method: string | symbol,
    managerConstructor: TAnyContextManagerConstructor
  ): void {
    if (!(managerConstructor.prototype instanceof ContextWorker)) {
      throw new TypeError("Only ContextWorker extending classes methods can be decorated as handlers.");
    }

    log.info("Query metadata written for context manager:", managerConstructor.name, queryType, method);

    if (!CONTEXT_QUERY_METADATA_REGISTRY.has(managerConstructor)) {
      CONTEXT_QUERY_METADATA_REGISTRY.set(managerConstructor, []);
    }

    CONTEXT_QUERY_METADATA_REGISTRY.get(managerConstructor)!.push([ method, queryType ]);
  });
}
