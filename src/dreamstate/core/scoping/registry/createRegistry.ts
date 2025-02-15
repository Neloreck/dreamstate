import {
  TAnyObject,
  TQueryListener,
  TQueryType,
  TManagerInstanceMap,
  TManagerMap,
  TSignalListener,
  TUpdateObserver,
  TUpdateSubscriber,
  TAnyValue,
} from "@/dreamstate/types";

/**
 * Internal registry object that stores mutable references, accounting for all Dreamstate scope data.
 * This interface defines the structure of the registry used to manage context, signals, and queries
 * within the Dreamstate scope. It contains various maps and sets that allow efficient tracking
 * and interaction with context managers, their states, observers, subscribers, signal listeners,
 * and query providers.
 */
export interface IRegistry {
  /**
   * Registry of currently provided context manager instances.
   * Stores instances of context managers for access and management.
   */
  CONTEXT_INSTANCES_REGISTRY: TManagerInstanceMap;

  /**
   * Registry of current scope manager states.
   * Used for accessing and synchronizing the states across context managers and their providers.
   */
  CONTEXT_STATES_REGISTRY: TManagerMap<TAnyObject>;

  /**
   * Provider references counting.
   * Tracks the reference count for each context manager instance.
   * If the count is greater than 0, the context manager should be active in the current scope.
   * If the reference count is 0, the context manager instance should be disposed.
   */
  CONTEXT_SERVICES_REFERENCES: TManagerMap<number>;

  /**
   * ContextManager observers registry for providers of related context.
   * Used by Dreamstate observer components to track and notify observers of context changes.
   */
  CONTEXT_OBSERVERS_REGISTRY: TManagerMap<Set<TUpdateObserver>>;

  /**
   * ContextManager subscribers registry for data updates.
   * Used by Pub-Sub subscribers to directly consume data updates from context managers.
   */
  CONTEXT_SUBSCRIBERS_REGISTRY: TManagerMap<Set<TUpdateSubscriber<TAnyValue>>>;

  /**
   * Registry of signal handlers.
   * Stores signal listeners that are registered to handle signals emitted within the scope.
   */
  SIGNAL_LISTENERS_REGISTRY: Set<TSignalListener<TAnyValue>>;

  /**
   * Registry of query request handlers.
   * Stores query providers for various query types that can return data for specific requests.
   */
  QUERY_PROVIDERS_REGISTRY: Map<TQueryType, Array<TQueryListener<TAnyValue, TAnyValue>>>;
}

/**
 * Creates a new registry to hold internal stores for the current scope.
 *
 * This function returns an `IRegistry` object containing several collections (e.g., `Map`, `Set`)
 * that are used to store mutable data such as query providers, signal listeners, context instances,
 * context states, services references, observers, and subscribers within the current scope.
 * The registry facilitates the management and access of these stores during the application's lifecycle.
 *
 * @returns {IRegistry} The newly created registry containing various internal stores used for scope management.
 */
export function createRegistry(): IRegistry {
  return {
    QUERY_PROVIDERS_REGISTRY: new Map(),
    SIGNAL_LISTENERS_REGISTRY: new Set(),
    CONTEXT_INSTANCES_REGISTRY: new Map(),
    CONTEXT_STATES_REGISTRY: new Map(),
    CONTEXT_SERVICES_REFERENCES: new Map(),
    CONTEXT_OBSERVERS_REGISTRY: new Map(),
    CONTEXT_SUBSCRIBERS_REGISTRY: new Map(),
  };
}
