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

export { ContextManager, ContextService } from "@Lib/management";

export { getCurrentContext, getCurrent } from "@Lib/registry";

export { createProvider, Provide, withProvision } from "@Lib/provision";

export { OnSignal, useSignals, unsubscribeFromSignals, subscribeToSignals, emitSignal } from "@Lib/signals";

export { OnQuery } from "@Lib/queries";

export { useManager, Consume, withConsumption } from "@Lib/consumption";

export { Bind } from "@Lib/utils/Bind";
export { createLoadable } from "@Lib/utils/createLoadable";
export { createMutable } from "@Lib/utils/createMutable";
export { createSetter } from "@Lib/utils/createSetter";
