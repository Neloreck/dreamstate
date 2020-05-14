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
} from "@Lib/types";

export { ContextService } from "@Lib/management/ContextService";
export { ContextManager } from "@Lib/management/ContextManager";

export { getCurrentContext } from "@Lib/registry/getCurrentContext";
export { getCurrent } from "@Lib/registry/getCurrent";

export { createProvider } from "@Lib/provision/createProvider";
export { Provide } from "@Lib/provision/Provide";
export { withProvision } from "@Lib/provision/withProvision";

export { OnSignal } from "@Lib/signals/OnSignal";
export { useSignals } from "@Lib/signals/useSignals";
export { unsubscribeFromSignals } from "@Lib/signals/unsubscribeFromSignals";
export { subscribeToSignals } from "@Lib/signals/subscribeToSignals";
export { emitSignal } from "@Lib/signals/emitSignal";

export { OnQuery } from "@Lib/queries/OnQuery";

export { useManager } from "@Lib/consumption/useManager";
export { Consume } from "@Lib/consumption/Consume";
export { withConsumption } from "@Lib/consumption/withConsumption";

export { Bind } from "@Lib/utils/Bind";
export { createLoadable } from "@Lib/utils/createLoadable";
export { createMutable } from "@Lib/utils/createMutable";
export { createSetter } from "@Lib/utils/createSetter";
