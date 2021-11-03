import type { Context } from "react";

import type { ContextManager } from "@/dreamstate/core/services/ContextManager";
import type { TAnyObject } from "@/dreamstate/types/general";
import type { TQuerySubscriptionMetadata } from "@/dreamstate/types/queries";
import type { TSignalSubscriptionMetadata } from "@/dreamstate/types/signals";

/**
 * Context manager class reference.
 */
export interface IContextManagerConstructor<
  T extends TAnyObject = TAnyObject,
  S extends TAnyObject = any,
  C extends ContextManager<T> = ContextManager<T>
> {
  REACT_CONTEXT: Context<T>;
  prototype: C;
  new (initialState?: S): C;
}

/**
 * Any context manager class reference.
 */
export type TAnyContextManagerConstructor = IContextManagerConstructor<any, any>;

/**
 * Typing for metadata containing in context manager.
 */
export type TContextManagerMetadata = TQuerySubscriptionMetadata | TSignalSubscriptionMetadata;

/**
 * Partial context manager 'context' field transformer.
 */
export type TPartialTransformer<T> = (value: T) => Partial<T>;

/**
 * Observers that are bound to provider elements.
 */
export type TUpdateObserver = () => void;

/**
 * Subscribers that are simply consuming context data if it is available.
 */
export type TUpdateSubscriber<T extends TAnyObject> = (context: T) => void;

export type TConstructorKey = any;

/**
 * Mutable map for manager class references.
 */
export type TManagerMap<T> = Map<TAnyContextManagerConstructor, T>;

/**
 * Mapping of manager instances and service class references.
 */
export type TManagerInstanceMap = TManagerMap<InstanceType<TAnyContextManagerConstructor>>;
