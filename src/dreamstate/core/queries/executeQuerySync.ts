import { ContextService } from "@/dreamstate/core/services/ContextService";
import {
  IOptionalQueryRequest,
  TAnyContextServiceConstructor,
  TQueryType
} from "@/dreamstate/types";

/**
 * Execute query and return result in a sync way.
 */
export function executeQuerySync<
  R,
  D = undefined,
  T extends TQueryType = TQueryType
>(
  service: ContextService,
  method: TQueryType,
  query: IOptionalQueryRequest<D, T>
) {
  return ({
    answerer: service.constructor as TAnyContextServiceConstructor,
    type: query.type,
    data: (service as any)[method](query),
    timestamp: Date.now()
  });
}
