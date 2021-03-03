import type { Context } from "react";

import type {
  TServiceMap,
  TQuerySubscriptionMetadata,
  TSignalListener,
  TSignalSubscriptionMetadata,
  TUpdateObserver,
  TUpdateSubscriber,
  TDreamstateService,
  TAnyObject
} from "@/dreamstate/types";

/**
 * Global shared constants.
 */

export const EMPTY_ARR: [] = [];

/**
 * Store related constants.
 */

// Currently active services instance types.
export const CONTEXT_SERVICES_ACTIVATED: Set<TDreamstateService> = new Set();

// Currently active services instance types.
export const CONTEXT_SERVICES_REFERENCES: TServiceMap<number> = new WeakMap();

// ReactContext registry, lazy initialized constants.
export const CONTEXT_REACT_CONTEXTS_REGISTRY: TServiceMap<Context<any>> = new WeakMap();

// ContextService instances registry.
export const CONTEXT_SERVICES_REGISTRY: TServiceMap<InstanceType<TDreamstateService>> = new WeakMap();

// ContextManagers context references registry.
export const CONTEXT_STATES_REGISTRY: TServiceMap<TAnyObject> = new WeakMap();

// ContextManagers observers registry - Providers of related context.
export const CONTEXT_OBSERVERS_REGISTRY: TServiceMap<Set<TUpdateObserver>> = new WeakMap();

// ContextManagers subscribers registry for data updates.
export const CONTEXT_SUBSCRIBERS_REGISTRY: TServiceMap<Set<TUpdateSubscriber<any>>> = new WeakMap();

// Signal handlers registry bound to context instances.
export const CONTEXT_SIGNAL_HANDLERS_REGISTRY: TServiceMap<TSignalListener<any>> = new WeakMap();

// Signal listeners metadata registry related to services.
export const CONTEXT_SIGNAL_METADATA_REGISTRY: TServiceMap<TSignalSubscriptionMetadata> = new WeakMap();

// Query listeners metadata registry related to services.
export const CONTEXT_QUERY_METADATA_REGISTRY: TServiceMap<TQuerySubscriptionMetadata> = new WeakMap();

// Global signal listeners registry.
export const SIGNAL_LISTENERS_REGISTRY: Set<TSignalListener<any, any>> = new Set();
