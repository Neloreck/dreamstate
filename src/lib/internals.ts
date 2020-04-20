import type {
  IStringIndexed,
  TSignalListener,
  TSignalSubs,
  TSignalType,
  TUpdateObserver,
  TUpdateSubscriber
} from "./types";
import type { ContextManager } from "./management";

declare const IS_DEV: boolean;
declare const IS_DEBUG: boolean;

export const EMPTY_STRING: string = "";
export const EMPTY_ARR: Array<never> = [];
export const MANAGER_REGEX: RegExp = /Manager$/;

export const IDENTIFIER_KEY: unique symbol = Symbol(IS_DEV ? "DS_ID" : "");
export const MUTABLE_KEY: unique symbol = Symbol(IS_DEV ? "DS_MUTABLE" : "");
export const SIGNAL_LISTENER_KEY: unique symbol = Symbol(IS_DEV ? "DS_SG_SUBSCRIBER" : "");

/**
 * Store related constants.
 */

export const CONTEXT_MANAGERS_REGISTRY: IStringIndexed<ContextManager<any>> = {};
export const CONTEXT_OBSERVERS_REGISTRY: IStringIndexed<Set<TUpdateObserver>> = {};
export const CONTEXT_SUBSCRIBERS_REGISTRY: IStringIndexed<Set<TUpdateSubscriber<any>>> = {};
export const CONTEXT_STATES_REGISTRY: IStringIndexed<any> = {};

export const SIGNAL_LISTENERS: Set<TSignalListener<any>> = new Set();
export const CONTEXT_MANAGERS_SIGNAL_LISTENERS_REGISTRY: IStringIndexed<TSignalSubs> = {};

/**
 * Expose internal registry references for debugging.
 */
if (IS_DEBUG) {
  // @ts-ignore debug-only declaration.
  window.__DREAMSTATE_DEBUG_INTERNALS__ = {
    CONTEXT_MANAGERS_REGISTRY,
    CONTEXT_OBSERVERS_REGISTRY,
    CONTEXT_SUBSCRIBERS_REGISTRY,
    CONTEXT_STATES_REGISTRY,
    CONTEXT_MANAGERS_SIGNAL_LISTENERS_REGISTRY,
    SIGNAL_LISTENERS
  };
}
