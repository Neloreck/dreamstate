import {
  TAnyObject,
  TQueryListener,
  TQueryType,
  TManagerInstanceMap,
  TManagerMap,
  TSignalListener,
  TUpdateObserver,
  TUpdateSubscriber
} from "@/dreamstate/types";

/**
 * Internal registry object that stores mutable references accounting all dreamstate scope data.
 */
export interface IRegistry {
  /**
   * Registry of currently provided context managers instances.
   */
  CONTEXT_INSTANCES_REGISTRY: TManagerInstanceMap;
  /**
   * Registry of current scope manager states.
   * Used for data accessing and sync across providers.
   */
  CONTEXT_STATES_REGISTRY: TManagerMap<TAnyObject>;
  /**
   * Provider references counting.
   * Used to determine whether specific manager should or should not exist.
   * If at least one provider exists, context manager should exist in current scope.
   * If reference count is 0, context manager instance should be disposed.
   */
  CONTEXT_SERVICES_REFERENCES: TManagerMap<number>;
  /**
   * ContextManagers observers registry for Providers of related context.
   * Used by dreamstate observer components.
   */
  CONTEXT_OBSERVERS_REGISTRY: TManagerMap<Set<TUpdateObserver>>;
  /**
   * ContextManagers subscribers registry for data updates.
   * Used by pub-sub subscribers that consume data directly.
   */
  CONTEXT_SUBSCRIBERS_REGISTRY: TManagerMap<Set<TUpdateSubscriber<any>>>;
  /**
   * Registry of signal handlers.
   */
  SIGNAL_LISTENERS_REGISTRY: Set<TSignalListener<any>>;
  /**
   * Registry of custom query requests handlers.
   */
  QUERY_PROVIDERS_REGISTRY: Map<TQueryType, Array<TQueryListener<any, any>>>;
}

/**
 * Create registry with internal stores.
 * Used in current scope to store mutable data.
 */
export function createRegistry(): IRegistry {
  return {
    QUERY_PROVIDERS_REGISTRY: new Map(),
    SIGNAL_LISTENERS_REGISTRY: new Set(),
    CONTEXT_INSTANCES_REGISTRY: new Map(),
    CONTEXT_STATES_REGISTRY: new Map(),
    CONTEXT_SERVICES_REFERENCES: new Map(),
    CONTEXT_OBSERVERS_REGISTRY: new Map(),
    CONTEXT_SUBSCRIBERS_REGISTRY: new Map()
  };
}
