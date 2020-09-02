/*
 * 'https://github.com/Neloreck/dreamstate'
 */

export {
  ILoadable as Loadable,
  TNested as Nested,
  TComputed as Computed,
  TStateSetter as StateSetter,
  TConsumable as Consumable,
  ISignalEvent as SignalEvent,
  ISignal as Signal,
  TSignalType as SignalType,
  TQueryResponse as QueryResponse,
  TOptionalQueryResponse as OptionalQueryResponse,
  TQueryRequest as QueryRequest,
  TQueryType as QueryType
} from "@/dreamstate/types";

export { ContextService } from "@/dreamstate/core/services/ContextService";
export { ContextManager } from "@/dreamstate/core/services/ContextManager";

export { getCurrentContext } from "@/dreamstate/core/registry/getCurrentContext";
export { getCurrent } from "@/dreamstate/core/registry/getCurrent";

export { createProvider } from "@/dreamstate/core/provision/createProvider";
export { Provide } from "@/dreamstate/core/provision/Provide";
export { withProvision } from "@/dreamstate/core/provision/withProvision";

export { OnSignal } from "@/dreamstate/core/signals/OnSignal";
export { useSignals } from "@/dreamstate/core/signals/useSignals";
export { unsubscribeFromSignals } from "@/dreamstate/core/signals/unsubscribeFromSignals";
export { subscribeToSignals } from "@/dreamstate/core/signals/subscribeToSignals";
export { emitSignal } from "@/dreamstate/core/signals/emitSignal";

export { OnQuery } from "@/dreamstate/core/queries/OnQuery";
export { queryData } from "@/dreamstate/core/queries/queryData";

export { useManager } from "@/dreamstate/core/consumption/useManager";
export { Consume } from "@/dreamstate/core/consumption/Consume";
export { withConsumption } from "@/dreamstate/core/consumption/withConsumption";

export { Bind } from "@/dreamstate/utils/Bind";
export { createLoadable } from "@/dreamstate/utils/createLoadable";
export { createNested } from "@/dreamstate/utils/createNested";
export { createComputed } from "@/dreamstate/utils/createComputed";
export { createSetter } from "@/dreamstate/utils/createSetter";
