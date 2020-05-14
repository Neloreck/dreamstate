/*
 * 'https://github.com/Neloreck/dreamstate'
 */

export {
  ILoadable as Loadable,
  TMutable as Mutable,
  TStateSetter as StateSetter,
  TConsumable as Consumable,
  ISignalEvent as SignalEvent,
  ISignal as Signal,
  TSignalType as SignalType,
  TQueryResponse as QueryResponse,
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

export { OnSignal } from "@/dreamstate/signals/OnSignal";
export { useSignals } from "@/dreamstate/signals/useSignals";
export { unsubscribeFromSignals } from "@/dreamstate/signals/unsubscribeFromSignals";
export { subscribeToSignals } from "@/dreamstate/signals/subscribeToSignals";
export { emitSignal } from "@/dreamstate/signals/emitSignal";

export { OnQuery } from "@/dreamstate/queries/OnQuery";

export { useManager } from "@/dreamstate/core/consumption/useManager";
export { Consume } from "@/dreamstate/core/consumption/Consume";
export { withConsumption } from "@/dreamstate/core/consumption/withConsumption";

export { Bind } from "@/dreamstate/utils/Bind";
export { createLoadable } from "@/dreamstate/utils/createLoadable";
export { createMutable } from "@/dreamstate/utils/createMutable";
export { createSetter } from "@/dreamstate/utils/createSetter";
