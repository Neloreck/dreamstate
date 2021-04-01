import { Context } from "react";

import type { ContextManager } from "@/dreamstate/core/services/ContextManager";
import type { ContextService } from "@/dreamstate/core/services/ContextService";
import type { TAnyObject } from "@/dreamstate/types/general";

export interface IContextServiceConstructor<S extends TAnyObject> {
  prototype: ContextService<S>;
  new (initialState?: S): ContextService<S>;
}

export interface IContextManagerConstructor<
  S extends TAnyObject,
  T extends TAnyObject,
  C extends ContextManager<T> = ContextManager<T>
> extends IContextServiceConstructor<S> {
  REACT_CONTEXT: Context<T>;
  prototype: C;
  new (initialState?: S): C;
}

export type TAnyContextManagerConstructor = IContextManagerConstructor<any, any>;

export type TAnyContextServiceConstructor = IContextServiceConstructor<any>;

export type TDreamstateService<S extends TAnyObject> = IContextServiceConstructor<S>;

export type TPartialTransformer<T> = (value: T) => Partial<T>;

export type TUpdateObserver = () => void;

export type TUpdateSubscriber<T extends TAnyObject> = (context: T) => void;

export type TConstructorKey = any;

export type TServiceMap<T> = WeakMap<TAnyContextServiceConstructor, T>;
