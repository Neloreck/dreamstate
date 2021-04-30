import type { Context } from "react";

import type {
  TServiceMap,
  TQuerySubscriptionMetadata,
  TSignalListener,
  TSignalSubscriptionMetadata,
  TUpdateObserver,
  TUpdateSubscriber,
  TAnyObject,
  TAnyContextManagerConstructor,
  TQueryType,
  TQueryListener
} from "@/dreamstate/types";

/**
 * Global shared constants.
 */

export const EMPTY_ARR: [] = [];

/**
 * Store related constants.
 */

// Currently active services instance types.
export const CONTEXT_SERVICES_ACTIVATED: Set<TAnyContextManagerConstructor> = new Set();

// Currently active services instance types.
export const CONTEXT_SERVICES_REFERENCES: TServiceMap<number> = new WeakMap();

// ReactContext registry, lazy initialized constants.
export const CONTEXT_REACT_CONTEXTS_REGISTRY: TServiceMap<Context<any>> = new WeakMap();

// ContextManager instances registry.
export const CONTEXT_SERVICES_REGISTRY: TServiceMap<InstanceType<TAnyContextManagerConstructor>> = new WeakMap();

// ContextManagers context references registry.
export const CONTEXT_STATES_REGISTRY: TServiceMap<TAnyObject> = new WeakMap();

// ContextManagers observers registry - Providers of related context.
export const CONTEXT_OBSERVERS_REGISTRY: TServiceMap<Set<TUpdateObserver<any>>> = new WeakMap();

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

// Global query providers registry.
export const QUERY_PROVIDERS_REGISTRY: Map<TQueryType, Array<TQueryListener<any, any>>> = new Map();
