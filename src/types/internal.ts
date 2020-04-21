import type { Context } from "react";

import type { IDENTIFIER_KEY } from "../internals";
import type { ContextManager } from "../management";

export interface IContextManagerConstructor<T extends object> {
  [IDENTIFIER_KEY]: any;
  REACT_CONTEXT: Context<T>;
  prototype: ContextManager<T>;
  new(): ContextManager<T>;
}

export type TAnyContextManagerConstructor = IContextManagerConstructor<any>;

export type TPartialTransformer<T> = (value: T) => Partial<T>;

export type TUpdateObserver = () => void;

export type TUpdateSubscriber<T extends object> = (context: T) => void;
