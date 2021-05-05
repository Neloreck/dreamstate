import {
  TAnyContextManagerConstructor, TAnyObject,
  TQueryListener,
  TQueryType,
  TServiceMap,
  TSignalListener, TUpdateObserver, TUpdateSubscriber
} from "@/dreamstate/types";

export interface IRegistry {
  SIGNAL_LISTENERS_REGISTRY: Set<TSignalListener<any, any>>;
  QUERY_PROVIDERS_REGISTRY: Map<TQueryType, Array<TQueryListener<any, any>>>;
  CONTEXT_SERVICES_REGISTRY: TServiceMap<InstanceType<TAnyContextManagerConstructor>>;
  CONTEXT_STATES_REGISTRY: TServiceMap<TAnyObject>;
  CONTEXT_SERVICES_REFERENCES: TServiceMap<number>;
  CONTEXT_SERVICES_ACTIVATED: Set<TAnyContextManagerConstructor>;
  // ContextManagers observers registry - Providers of related context.
  CONTEXT_OBSERVERS_REGISTRY: TServiceMap<Set<TUpdateObserver>>;
  // ContextManagers subscribers registry for data updates.
  CONTEXT_SUBSCRIBERS_REGISTRY: TServiceMap<Set<TUpdateSubscriber<any>>>;
}

/**
 * Create registry with internal stores.
 */
export function createRegistry(): IRegistry {
  return ({
    CONTEXT_SERVICES_ACTIVATED: new Set(),
    QUERY_PROVIDERS_REGISTRY: new Map(),
    SIGNAL_LISTENERS_REGISTRY: new Set(),
    CONTEXT_SERVICES_REGISTRY: new Map(),
    CONTEXT_STATES_REGISTRY: new Map(),
    CONTEXT_SERVICES_REFERENCES: new Map(),
    CONTEXT_OBSERVERS_REGISTRY: new Map(),
    CONTEXT_SUBSCRIBERS_REGISTRY: new Map()
  });
}
