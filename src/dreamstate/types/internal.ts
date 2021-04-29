import { Context } from "react";

import type { ContextManager } from "@/dreamstate/core/services/ContextManager";
import type { TAnyObject } from "@/dreamstate/types/general";

export interface IContextManagerConstructor<
  S extends TAnyObject,
  T extends TAnyObject,
  C extends ContextManager<T> = ContextManager<T>
> {
  REACT_CONTEXT: Context<T>;
  prototype: C;
  new (initialState?: S): C;
}

export type TAnyContextManagerConstructor = IContextManagerConstructor<any, any>;

export type TPartialTransformer<T> = (value: T) => Partial<T>;

export type TUpdateObserver = () => void;

export type TUpdateSubscriber<T extends TAnyObject> = (context: T) => void;

export type TConstructorKey = any;

export type TServiceMap<T> = WeakMap<TAnyContextManagerConstructor, T>;
