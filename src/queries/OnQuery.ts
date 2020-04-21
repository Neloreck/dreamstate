import { TAnyContextManagerConstructor, TQueryType } from "../types";
import { CONTEXT_QUERY_METADATA_REGISTRY, IDENTIFIER_KEY } from "../internals";
import { createMethodDecorator } from "../polyfills";

import { log } from "../../build/macroses/log.macro";

export function OnQuery(queryType: TQueryType): MethodDecorator {
  return createMethodDecorator<TAnyContextManagerConstructor>(function rememberMethodQuery(
    method: string | symbol,
    managerConstructor: TAnyContextManagerConstructor
  ): void {
    log.info("Query metadata written for context manager:", managerConstructor.name, queryType, method);

    CONTEXT_QUERY_METADATA_REGISTRY[managerConstructor[IDENTIFIER_KEY]].push([ method, queryType ]);
  });
}
