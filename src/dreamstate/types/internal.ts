import { Context } from "react";

import type { ContextManager } from "@/dreamstate/core/services/ContextManager";
import type { ContextService } from "@/dreamstate/core/services/ContextService";
import type { TAnyObject } from "@/dreamstate/types/general";

export interface IContextServiceConstructor {
  prototype: ContextService;
  new (): ContextService;
}

export interface IContextManagerConstructor<T extends TAnyObject> extends IContextServiceConstructor {
  REACT_CONTEXT: Context<T>;
  prototype: ContextManager<T>;
  new (): ContextManager<T>;
}

export type TAnyContextManagerConstructor = IContextManagerConstructor<any>;

export type TDreamstateService = IContextServiceConstructor;

export type TPartialTransformer<T> = (value: T) => Partial<T>;

export type TUpdateObserver = () => void;

export type TUpdateSubscriber<T extends TAnyObject> = (context: T) => void;

export type TConstructorKey = any;

export type TServiceMap<T> = WeakMap<TDreamstateService, T>;
