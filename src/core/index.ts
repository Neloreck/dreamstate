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
} from "@Lib/core/types";

export { ContextService } from "@Lib/core/management/ContextService";
export { ContextManager } from "@Lib/core/management/ContextManager";

export { getCurrentContext } from "@Lib/core/registry/getCurrentContext";
export { getCurrent } from "@Lib/core/registry/getCurrent";

export { createProvider } from "@Lib/core/provision/createProvider";
export { Provide } from "@Lib/core/provision/Provide";
export { withProvision } from "@Lib/core/provision/withProvision";

export { OnSignal } from "@Lib/core/signals/OnSignal";
export { useSignals } from "@Lib/core/signals/useSignals";
export { unsubscribeFromSignals } from "@Lib/core/signals/unsubscribeFromSignals";
export { subscribeToSignals } from "@Lib/core/signals/subscribeToSignals";
export { emitSignal } from "@Lib/core/signals/emitSignal";

export { OnQuery } from "@Lib/core/queries/OnQuery";

export { useManager } from "@Lib/core/consumption/useManager";
export { Consume } from "@Lib/core/consumption/Consume";
export { withConsumption } from "@Lib/core/consumption/withConsumption";

export { Bind } from "@Lib/core/utils/Bind";
export { createLoadable } from "@Lib/core/utils/createLoadable";
export { createMutable } from "@Lib/core/utils/createMutable";
export { createSetter } from "@Lib/core/utils/createSetter";
