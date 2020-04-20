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
  ISignal as Signal
} from "./lib/types";

export { ContextManager } from "./lib/management";

export { subscribeToManager, unsubscribeFromManager, getCurrentContext, getCurrentManager } from "./lib/registry";

export { createProvider, Provide, withProvision } from "./lib/provision";

export { OnSignal, useSignal, unsubscribeFromSignals, subscribeToSignals } from "./lib/signals";

export { useManager, Consume, withConsumption } from "./lib/consumption";

export { Bind, createLoadable, createMutable, createSetter } from "./lib/utils";

