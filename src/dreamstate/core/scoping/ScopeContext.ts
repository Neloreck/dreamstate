import { Context, createContext } from "react";

import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  IBaseSignal,
  IContextManagerConstructor,
  IOptionalQueryRequest,
  ISignalEvent,
  TAnyContextManagerConstructor,
  TAnyObject,
  TAnyValue,
  TCallable,
  TQueryListener,
  TQueryResponse,
  TQueryType,
  TSignalListener,
  TUpdateObserver,
  TUpdateSubscriber,
} from "@/dreamstate/types";

/**
 * Internals of the scope context, meant for internal use only.
 *
 * This interface defines the internal properties and methods for managing data flow, signals,
 * and queries within the scope. It is not intended for external access and should only be used
 * by the `dreamstate` library for its internal operations.
 */
export interface IScopeContextInternals {
  /**
   * Mutable registry that contains all references and scope data.
   */
  REGISTRY: IRegistry;

  /**
   * Registers a `ManagerClass` in the current scope and creates an instance for context provision.
   *
   * @template T - Type of initial state injected into the manager.
   * @template C - Type of initial context injected into the manager.
   * @param {IContextManagerConstructor} ManagerClass - The manager class that should be registered in the scope.
   * @param {T | null} [initialState] - Optional initial state parameter that will be injected into the manager's
   *   constructor upon creation.
   * @param {Partial<C>} [initialContext] - Optional initial context parameter that will be injected into the
   *   manager and mixed with the context.
   * @returns {boolean} `true` if the service was successfully registered, `false` otherwise.
   */
  registerService<T extends TAnyObject, C extends TAnyObject>(
    ManagerClass: TAnyContextManagerConstructor,
    initialState?: T | null,
    initialContext?: Partial<C>
  ): boolean;

  /**
   * Unregisters a `ManagerClass` from the current scope.
   * Cleans up memory and removes all internal references associated with the manager.
   *
   * @param {TAnyContextManagerConstructor} ManagerClass - The manager class that should be unregistered from the scope.
   * @returns {boolean} `true` if the service was successfully unregistered, `false` otherwise.
   */
  unRegisterService(ManagerClass: TAnyContextManagerConstructor): boolean;

  /**
   * Adds an observer to a specified service.
   * The observer will be notified when the manager's context is updated.
   *
   * @template T - Type of the manager's context.
   * @param {TAnyContextManagerConstructor} ManagerClass - The manager class reference for which the observer
   *   should be added.
   * @param {TUpdateObserver} serviceObserver - The observer that should be notified on manager updates.
   * @param {number} [referencesCount] - Optional count of manager references for injection.
   *   By default, checks the registry.
   */
  addServiceObserver(
    ManagerClass: TAnyContextManagerConstructor,
    serviceObserver: TUpdateObserver,
    referencesCount?: number
  ): void;

  /**
   * Removes an observer from a specified service.
   * The observer will no longer be notified of updates from the manager's context.
   *
   * @template T - Type of the manager's context.
   * @param {TAnyContextManagerConstructor} ManagerClass - The manager class reference for which
   *   the observer should be removed.
   * @param {TUpdateObserver} serviceObserver - The observer that should be removed from the registry.
   * @param {number} [referencesCount] - Optional count of manager references for injection.
   *   By default, checks the registry.
   */
  removeServiceObserver(
    ManagerClass: TAnyContextManagerConstructor,
    serviceObserver: TUpdateObserver,
    referencesCount?: number
  ): void;

  /**
   * Notifies all observers that are subscribed to a manager's context updates.
   * This will update all providers based on the current context of the provided manager instance.
   *
   * @template T - Type of the manager's context.
   * @param {ContextManager<T>} manager - The manager instance whose context should trigger updates
   *   to subscribed providers.
   */
  notifyObservers<T extends TAnyObject>(manager: ContextManager<T>): void;

  /**
   * Subscribes to manager context updates.
   * The provided callback will be triggered whenever the manager's context is updated.
   *
   * @template T - Type of the manager's context.
   * @template D - Type of the context manager constructor.
   * @param {IContextManagerConstructor} ManagerClass - The manager class reference for which to subscribe.
   * @param {TUpdateSubscriber<T>} subscriber - The callback function that will be triggered on context updates.
   * @returns {TCallable} A function that can be used to unsubscribe from context updates.
   */
  subscribeToManager<T extends TAnyObject, D extends IContextManagerConstructor<TAnyValue, T>>(
    ManagerClass: D,
    subscriber: TUpdateSubscriber<T>
  ): TCallable;

  /**
   * Unsubscribes from manager context updates.
   *
   * @template T - Type of the manager's context.
   * @template D - Type of the context manager constructor.
   * @param {IContextManagerConstructor} ManagerClass - The manager class reference for which to unsubscribe.
   * @param {TUpdateSubscriber<T>} subscriber - The callback function that should be removed
   *   from context updates subscription.
   */
  unsubscribeFromManager<T extends TAnyObject, D extends IContextManagerConstructor<TAnyValue, T>>(
    ManagerClass: D,
    subscriber: TUpdateSubscriber<T>
  ): void;
}

/**
 * Represents the current scope context.
 * Provides public methods to interact with the current scope, including managing context, signals, and queries.
 */
export interface IScopeContext {
  /**
   * Library internals.
   * Not intended for normal use, except during unit testing.
   */
  INTERNAL: IScopeContextInternals;

  /**
   * Retrieves the current context snapshot for the given manager class.
   *
   * @template T - Type of the context.
   * @template D - Type of the context manager constructor.
   * @param manager - The manager class whose context is to be retrieved.
   * @returns The current context snapshot for the specified manager.
   */
  getContextOf<T extends TAnyObject, D extends IContextManagerConstructor<T>>(manager: D): T;

  /**
   * Emits a signal for all subscribers in the current Dreamstate scope.
   *
   * @template D - Type of the signal data.
   * @param base - The base signal object that triggers the event.
   *   It includes a `type` field  and an optional `data` field.
   * @param emitter - Optional signal emitter reference.
   * @returns A signal event instance that wraps the emitted signal.
   */
  emitSignal<D = undefined>(base: IBaseSignal<D>, emitter?: TAnyContextManagerConstructor | null): ISignalEvent<D>;

  /**
   * Subscribes to signals within the current scope.
   * The listener will be invoked on every signal event.
   *
   * @template D - Type of the signal data.
   * @param listener - The callback function to be invoked on signal events.
   * @returns A callable function that unsubscribes the listener.
   */
  subscribeToSignals<D = undefined>(listener: TSignalListener<D>): TCallable;

  /**
   * Unsubscribes a listener from signals in the current scope.
   * The provided listener will no longer be invoked on signal events.
   *
   * @template D - Type of the signal data.
   * @param listener - The callback function to remove from signal subscriptions.
   */
  unsubscribeFromSignals<D = undefined>(listener: TSignalListener<D>): void;

  /**
   * Registers a query provider callback to answer query data calls.
   *
   * @template T - Type of the query.
   * @param queryType - The type of query for data provisioning.
   * @param listener - The callback that listens to queries and returns evaluation data.
   * @returns A callable function that unregisters the query provider.
   */

  registerQueryProvider<T extends TQueryType>(queryType: T, listener: TQueryListener<T, TAnyValue>): TCallable;

  /**
   * Unregisters a query provider callback.
   * The callback will no longer handle query data calls.
   *
   * @template T - Type of the query.
   * @param queryType - The type of query for which the provider is unregistered.
   * @param listener - The callback to be unregistered.
   */
  unRegisterQueryProvider<T extends TQueryType>(queryType: T, listener: TQueryListener<T, TAnyValue>): void;

  /**
   * Queries data synchronously from the current scope.
   * The handler for the specified query type is executed, and its result is wrapped as a query response.
   *
   * @template D - Type of the data provided in the query request.
   * @template T - Type of the query.
   * @template Q - Type of the query request.
   * @param query - The query request containing the query type and optional data.
   * @returns The query response or null if no handler is found.
   */
  queryDataSync<D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(query: Q): TQueryResponse<TAnyValue>;

  /**
   * Queries data asynchronously from the current scope.
   * The handler for the specified query type is executed, and its result is wrapped as a query response.
   *
   * @template D - Type of the data provided in the query request.
   * @template T - Type of the query.
   * @template Q - Type of the query request.
   * @param query - The query request containing the query type and optional data.
   * @returns A promise that resolves with the query response or null if no handler is found.
   */
  queryDataAsync<D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
    query: Q
  ): Promise<TQueryResponse<TAnyValue>>;
}

/**
 * React context reference for the Dreamstate scope, used to wrap the virtual DOM tree.
 * This context allows the React tree to be aware of the current scope and provides access
 * to context management functionalities within the Dreamstate data flow.
 */
export const ScopeContext: Context<IScopeContext> = createContext(null as unknown as IScopeContext);
