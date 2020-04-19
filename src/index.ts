/*
 *
 * 'https://github.com/Neloreck/dreamstate'
 *
 * OOP style context store for react.
 * Based on observing and using as small tree components count as possible.
 */

export { ILoadable, TLoadable, TMutable, TStateSetter, TConsumable, ISignal, IBaseSignal } from "./lib/types";

export { ContextManager } from "./lib/management";

export { subscribeToManager, unsubscribeFromManager, getCurrentContext, getCurrentManager } from "./lib/registry";

export { createProvider, Provide, withProvision } from "./lib/provision";

export { useManager, Consume, withConsumption } from "./lib/consumption";

export { Bind, createLoadable, createMutable, createSetter } from "./lib/utils";

export { Signal, useSignal, unsubscribeFromSignals, subscribeToSignals } from "./lib/signals";
