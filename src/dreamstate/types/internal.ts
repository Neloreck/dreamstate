import type { Context } from "react";

import type { QUERY_METADATA_SYMBOL, SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
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
  [QUERY_METADATA_SYMBOL]: TQuerySubscriptionMetadata;
  [SIGNAL_METADATA_SYMBOL]: TSignalSubscriptionMetadata;
}

/**
 * Any context manager class reference.
 */
export type TAnyContextManagerConstructor = IContextManagerConstructor<any, any>;

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
