/*
 *
 * 'https://github.com/Neloreck/dreamstate'
 *
 * OOP style context store for react.
 * Based on observing and using as small react tree components count as possible.
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
} from "./types";

export { ContextManager, ContextWorker } from "./management";

export { getCurrentContext, getCurrent } from "./registry";

export { createProvider, Provide, withProvision } from "./provision";

export { OnSignal, useSignals, unsubscribeFromSignals, subscribeToSignals, emitSignal } from "./signals";

export { OnQuery } from "./queries";

export { useManager, Consume, withConsumption } from "./consumption";

export { Bind, createLoadable, createMutable, createSetter } from "./utils";
