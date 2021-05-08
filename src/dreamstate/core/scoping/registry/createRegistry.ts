import {
  TAnyContextManagerConstructor,
  TAnyObject,
  TQueryListener,
  TQueryType,
  TSignalListener,
  TUpdateObserver,
  TUpdateSubscriber
} from "@/dreamstate/types";

/**
 * Mutable map for manager class references.
 */
type TServiceMap<T> = Map<TAnyContextManagerConstructor, T>;

/**
 * Internal registry object that stores mutable references accounting all dreamstate scope data.
 */
export interface IRegistry {
  /**
   * Registry of currently provided context managers instances.
   * todo: Rename to CONTEXT_INSTANCES_REGISTRY.
   */
  CONTEXT_SERVICES_REGISTRY: TServiceMap<InstanceType<TAnyContextManagerConstructor>>;
  /**
   * Registry of current scope manager states.
   * Used for data accessing and sync across providers.
   */
  CONTEXT_STATES_REGISTRY: TServiceMap<TAnyObject>;
  /**
   * Provider references counting.
   * Used to determine whether specific manager should or should not exist.
   * If at least one provider exists, context manager should exist in current scope.
   * If reference count is 0, context manager instance should be disposed.
   */
  CONTEXT_SERVICES_REFERENCES: TServiceMap<number>;
  /**
   * Set of class references that are provided in current context.
   * Used mainly for metadata accessing.
   */
  CONTEXT_SERVICES_ACTIVATED: Set<TAnyContextManagerConstructor>;
  /**
   * ContextManagers observers registry for Providers of related context.
   * Used by dreamstate observer components.
   */
  CONTEXT_OBSERVERS_REGISTRY: TServiceMap<Set<TUpdateObserver>>;
  /**
   * ContextManagers subscribers registry for data updates.
   * Used by pub-sub subscribers that consume data directly.
   */
  CONTEXT_SUBSCRIBERS_REGISTRY: TServiceMap<Set<TUpdateSubscriber<any>>>;
  /**
   * Registry of signal handlers.
   */
  SIGNAL_LISTENERS_REGISTRY: Set<TSignalListener<any, any>>;
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
