import type { Context } from "react";

import type { ContextManager } from "@/dreamstate/core/services/ContextManager";
import type { TAnyObject, TAnyValue } from "@/dreamstate/types/general";
import type { TQuerySubscriptionMetadata } from "@/dreamstate/types/queries";
import type { TSignalSubscriptionMetadata } from "@/dreamstate/types/signals";

/**
 * Context manager class reference.
 * Defines a constructor signature for a context manager, including its associated context.
 */
export interface IContextManagerConstructor<
  T extends TAnyObject = TAnyObject,
  S extends TAnyObject = TAnyValue,
  C extends ContextManager<T> = ContextManager<T>,
> {
  REACT_CONTEXT: Context<T>;
  prototype: C;

  new (initialState?: S): C;
}

/**
 * A reference to any context manager class.
 * Represents a context manager class with any state and context type.
 */
export type TAnyContextManagerConstructor = IContextManagerConstructor<TAnyValue, TAnyValue>;

/**
 * Typing for metadata contained within a context manager.
 * Can represent metadata for either query or signal subscriptions.
 */
export type TContextManagerMetadata = TQuerySubscriptionMetadata | TSignalSubscriptionMetadata;

/**
 * A partial transformer for the context manager's 'context' field.
 * Transforms the context value into a partial version of the context.
 */
export type TPartialTransformer<T> = (value: T) => Partial<T>;

/**
 * Observers that are bound to provider elements.
 * These observers are triggered to react to changes in the context.
 */
export type TUpdateObserver = () => void;

/**
 * Subscribers that consume context data when it is available.
 * These subscribers receive context updates and handle the data.
 */
export type TUpdateSubscriber<T extends TAnyObject> = (context: T) => void;

/**
 * A generic key type used for context manager constructors.
 */
export type TConstructorKey = TAnyValue;

/**
 * A mutable map that stores manager class references.
 * Maps context manager classes to instances of their associated manager.
 */
export type TManagerMap<T> = Map<TAnyContextManagerConstructor, T>;

/**
 * A mapping of manager instances and their corresponding service class references.
 * Maps context manager constructors to their created instances.
 */
export type TManagerInstanceMap = TManagerMap<InstanceType<TAnyContextManagerConstructor>>;
