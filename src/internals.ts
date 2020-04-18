import { Context } from "react";

import { ContextManager } from "./ContextManager";
import { IStringIndexed, TUpdateObserver, TUpdateSubscriber } from "./types";

declare const IS_DEV: boolean;

export const EMPTY_STRING: string = "";
export const EMPTY_ARR: Array<never> = [];
export const MANAGER_REGEX: RegExp = /Manager$/;

export const IDENTIFIER_KEY: unique symbol = Symbol(IS_DEV ? "DS_ID" : "");
export const MUTABLE_KEY: unique symbol = Symbol(IS_DEV ? "DS_MUTABLE" : "");

export const STORE_REGISTRY: {
  MANAGERS: IStringIndexed<ContextManager<any>>;
  OBSERVERS: IStringIndexed<Set<TUpdateObserver>>;
  SUBSCRIBERS: IStringIndexed<Set<TUpdateSubscriber<any>>>;
  CONTEXTS: IStringIndexed<Context<any>>;
  STATES: IStringIndexed<any>;
} = {
  MANAGERS: {},
  OBSERVERS: {},
  SUBSCRIBERS: {},
  CONTEXTS: {},
  STATES: {}
};
