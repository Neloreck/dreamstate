import type {
  IStringIndexed,
  TQuerySubscriptionMetadata,
  TSignalListener,
  TSignalSubscriptionMetadata,
  TUpdateObserver,
  TUpdateSubscriber
} from "./types";
import type { ContextManager } from "./management";

export const EMPTY_STRING: string = "";
export const MANAGER_REGEX: RegExp = /Manager$/;
export const EMPTY_ARR: [] = [];

export const IDENTIFIER_KEY: unique symbol = Symbol();
export const NESTED_STORE_KEY: unique symbol = Symbol();

/**
 * Store related constants.
 */

export const CONTEXT_MANAGERS_REGISTRY: IStringIndexed<ContextManager<any>> = {};
export const CONTEXT_OBSERVERS_REGISTRY: IStringIndexed<Set<TUpdateObserver>> = {};
export const CONTEXT_SUBSCRIBERS_REGISTRY: IStringIndexed<Set<TUpdateSubscriber<any>>> = {};
export const CONTEXT_STATES_REGISTRY: IStringIndexed<any> = {};
export const CONTEXT_SIGNAL_METADATA_REGISTRY: IStringIndexed<TSignalSubscriptionMetadata> = {};
export const CONTEXT_SIGNAL_HANDLERS_REGISTRY: IStringIndexed<TSignalListener<any>> = {};
export const CONTEXT_QUERY_METADATA_REGISTRY: IStringIndexed<TQuerySubscriptionMetadata> = {};

export const SIGNAL_LISTENERS_REGISTRY: Set<TSignalListener<any>> = new Set();

/**
 * Expose internal registry references for debugging.
 */
declare const IS_DEBUG: boolean;

if (IS_DEBUG) {
  // @ts-ignore debug-only declaration.
  window.__DREAMSTATE_DEBUG_INTERNALS__ = {
    CONTEXT_MANAGERS_REGISTRY,
    CONTEXT_OBSERVERS_REGISTRY,
    CONTEXT_SUBSCRIBERS_REGISTRY,
    CONTEXT_STATES_REGISTRY,
    CONTEXT_SIGNAL_METADATA_REGISTRY,
    CONTEXT_SIGNAL_HANDLERS_REGISTRY,
    CONTEXT_QUERY_METADATA_REGISTRY,
    SIGNAL_LISTENERS_REGISTRY
  };
}
