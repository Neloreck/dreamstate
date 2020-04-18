/*
 *
 * 'https://github.com/Neloreck/dreamstate'
 *
 * OOP style context store for react.
 * Based on observing and using as small tree components count as possible.
 */

export { ILoadable, TLoadable, TMutable, TStateSetter, TConsumable } from "./types";

export { ContextManager } from "./ContextManager";

export { Bind, createLoadable, createMutable } from "./utils";

export { createProvider, Provide, withProvision } from "./provision";

export { useManager, Consume, withConsumption } from "./consumption";
