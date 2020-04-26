import type { Context } from "react";

import type { ContextWorker, ContextManager, ContextInterceptor } from "../management";

export interface IContextManagerConstructor<T extends object> {
  REACT_CONTEXT: Context<T>;
  prototype: ContextManager<T>;
  new (): ContextManager<T>;
}

export interface IContextInterceptorConstructor {
  prototype: ContextInterceptor;
  new (): ContextInterceptor;
}

export interface IContextWorkerConstructor {
  prototype: ContextWorker;
  new (): ContextWorker;
}

export type TAnyContextManagerConstructor = IContextManagerConstructor<any>;

export type TDreamstateWorker = IContextWorkerConstructor;

export type TPartialTransformer<T> = (value: T) => Partial<T>;

export type TUpdateObserver = () => void;

export type TUpdateSubscriber<T extends object> = (context: T) => void;

export type TConstructorKey = any;

export type TWorkerMap<T> = WeakMap<TDreamstateWorker, T>;
