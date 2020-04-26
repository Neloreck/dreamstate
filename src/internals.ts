import type { Context } from "react";

import type {
  TWorkerMap,
  TQuerySubscriptionMetadata,
  TSignalListener,
  TSignalSubscriptionMetadata,
  TUpdateObserver,
  TUpdateSubscriber, TDreamstateWorker
} from "./types";

export const EMPTY_STRING: string = "";
export const MANAGER_REGEX: RegExp = /Manager$/;
export const EMPTY_ARR: [] = [];

export const NESTED_STORE_KEY: unique symbol = Symbol();

/**
 * Store related constants.
 */

export const CONTEXT_WORKERS_ACTIVATED: Set<TDreamstateWorker> = new Set();

export const CONTEXT_REACT_CONTEXTS_REGISTRY: TWorkerMap<Context<any>> = new WeakMap();
export const CONTEXT_WORKERS_REGISTRY: TWorkerMap<InstanceType<TDreamstateWorker>> = new WeakMap();
export const CONTEXT_STATES_REGISTRY: TWorkerMap<object> = new WeakMap();

export const CONTEXT_OBSERVERS_REGISTRY: TWorkerMap<Set<TUpdateObserver>> = new WeakMap();
export const CONTEXT_SUBSCRIBERS_REGISTRY: TWorkerMap<Set<TUpdateSubscriber<any>>> = new WeakMap();
export const CONTEXT_SIGNAL_HANDLERS_REGISTRY: TWorkerMap<TSignalListener<any>> = new WeakMap();

export const CONTEXT_SIGNAL_METADATA_REGISTRY: TWorkerMap<TSignalSubscriptionMetadata> = new WeakMap();
export const CONTEXT_QUERY_METADATA_REGISTRY: TWorkerMap<TQuerySubscriptionMetadata> = new WeakMap();

export const SIGNAL_LISTENERS_REGISTRY: Set<TSignalListener<any, any>> = new Set();

declare const IS_DEBUG: boolean;

if (IS_DEBUG) {
  // @ts-ignore debug-only declaration.
  window.__DREAMSTATE_DEBUG_INTERNALS__ = {
    CONTEXT_WORKERS_REGISTRY,
    CONTEXT_OBSERVERS_REGISTRY,
    CONTEXT_SUBSCRIBERS_REGISTRY,
    CONTEXT_STATES_REGISTRY,
    CONTEXT_SIGNAL_METADATA_REGISTRY,
    CONTEXT_SIGNAL_HANDLERS_REGISTRY,
    CONTEXT_QUERY_METADATA_REGISTRY,
    SIGNAL_LISTENERS_REGISTRY
  };
}
