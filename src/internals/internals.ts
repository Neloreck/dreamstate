import type { Context } from "react";

import type {
  TWorkerMap,
  TQuerySubscriptionMetadata,
  TSignalListener,
  TSignalSubscriptionMetadata,
  TUpdateObserver,
  TUpdateSubscriber,
  TDreamstateWorker
} from "../types";

/**
 * Global shared constants.
 */

export const EMPTY_ARR: [] = [];

/**
 * Store related constants.
 */

// Currently active workers instance types.
export const CONTEXT_WORKERS_ACTIVATED: Set<TDreamstateWorker> = new Set();

// ReactContext registry, lazy initialized constants.
export const CONTEXT_REACT_CONTEXTS_REGISTRY: TWorkerMap<Context<any>> = new WeakMap();

// ContextWorker instances registry.
export const CONTEXT_WORKERS_REGISTRY: TWorkerMap<InstanceType<TDreamstateWorker>> = new WeakMap();

// ContextManagers context references registry.
export const CONTEXT_STATES_REGISTRY: TWorkerMap<object> = new WeakMap();

// ContextManagers observers registry - Providers of related context.
export const CONTEXT_OBSERVERS_REGISTRY: TWorkerMap<Set<TUpdateObserver>> = new WeakMap();

// ContextManagers subscribers registry for data updates.
export const CONTEXT_SUBSCRIBERS_REGISTRY: TWorkerMap<Set<TUpdateSubscriber<any>>> = new WeakMap();

// Signal handlers registry bound to context instances.
export const CONTEXT_SIGNAL_HANDLERS_REGISTRY: TWorkerMap<TSignalListener<any>> = new WeakMap();

// Signal listeners metadata registry related to workers.
export const CONTEXT_SIGNAL_METADATA_REGISTRY: TWorkerMap<TSignalSubscriptionMetadata> = new WeakMap();

// Query listeners metadata registry related to workers.
export const CONTEXT_QUERY_METADATA_REGISTRY: TWorkerMap<TQuerySubscriptionMetadata> = new WeakMap();

// Global signal listeners registry.
export const SIGNAL_LISTENERS_REGISTRY: Set<TSignalListener<any, any>> = new Set();
