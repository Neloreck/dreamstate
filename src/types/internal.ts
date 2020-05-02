import type { Context } from "react";

import type { ContextWorker, ContextManager } from "../management";

export interface IContextWorkerConstructor {
  prototype: ContextWorker;
  new (): ContextWorker;
}

export interface IContextManagerConstructor<T extends object> extends IContextWorkerConstructor {
  REACT_CONTEXT: Context<T>;
  prototype: ContextManager<T>;
  new (): ContextManager<T>;
}

export type TAnyContextManagerConstructor = IContextManagerConstructor<any>;

export type TDreamstateWorker = IContextWorkerConstructor;

export type TPartialTransformer<T> = (value: T) => Partial<T>;

export type TUpdateObserver = () => void;

export type TUpdateSubscriber<T extends object> = (context: T) => void;

export type TConstructorKey = any;

export type TWorkerMap<T> = WeakMap<TDreamstateWorker, T>;
