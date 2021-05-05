import { Context } from "react";

import { QUERY_METADATA_SYMBOL, SIGNAL_METADATA_SYMBOL } from "@/dreamstate/core/internals";
import type { ContextManager } from "@/dreamstate/core/services/ContextManager";
import type { TAnyObject } from "@/dreamstate/types/general";
import type { TQueryType } from "@/dreamstate/types/queries";
import type { TSignalType } from "@/dreamstate/types/signals";

export interface IContextManagerConstructor<
  T extends TAnyObject = TAnyObject,
  S extends TAnyObject = TAnyObject,
  C extends ContextManager<T> = ContextManager<T>
> {
  REACT_CONTEXT: Context<T>;
  prototype: C;
  new (initialState?: S): C;
  [QUERY_METADATA_SYMBOL]: Array<[ string | symbol, TQueryType]>;
  [SIGNAL_METADATA_SYMBOL]: Array<[ string | symbol, Array<TSignalType> | TSignalType ]>;
}

export type TAnyContextManagerConstructor = IContextManagerConstructor<any, any>;

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

export type TServiceMap<T> = Map<TAnyContextManagerConstructor, T>;
