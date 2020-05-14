import { Context } from "react";

import type { ContextService } from "@Lib/management/ContextService";
import type { ContextManager } from "@Lib/management/ContextManager";

export interface IContextServiceConstructor {
  prototype: ContextService;
  new (): ContextService;
}

export interface IContextManagerConstructor<T extends object> extends IContextServiceConstructor {
  REACT_CONTEXT: Context<T>;
  prototype: ContextManager<T>;
  new (): ContextManager<T>;
}

export type TAnyContextManagerConstructor = IContextManagerConstructor<any>;

export type TDreamstateService = IContextServiceConstructor;

export type TPartialTransformer<T> = (value: T) => Partial<T>;

export type TUpdateObserver = () => void;

export type TUpdateSubscriber<T extends object> = (context: T) => void;

export type TConstructorKey = any;

export type TServiceMap<T> = WeakMap<TDreamstateService, T>;
