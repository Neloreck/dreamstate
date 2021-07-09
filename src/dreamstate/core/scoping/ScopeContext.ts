import { Context, createContext } from "react";

import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  IBaseSignal,
  IContextManagerConstructor,
  IOptionalQueryRequest, ISignalEvent,
  TAnyContextManagerConstructor,
  TAnyObject,
  TCallable,
  TQueryListener,
  TQueryResponse,
  TQueryType,
  TSignalListener,
  TSignalType,
  TUpdateObserver,
  TUpdateSubscriber
} from "@/dreamstate/types";

/**
 * Scope internals that normally should remain private and should not be accessed externally.
 * Used by dreamstate to manage data flow and signals/queries.
 */
export interface IScopeContextInternals {
  /**
   * Mutable registry that contains all references and scope data.
   */
  REGISTRY: IRegistry;
  /**
   * Register ManagerClass in current scope and create instance for context provision.
   *
   * @param {TAnyContextManagerConstructor} ManagerClass - manager reference that should be registered in scope.
   * @param {*=} initialState - initial state param that will be injected in manager constructor on creation.
   */
  registerService<T>(ManagerClass: TAnyContextManagerConstructor, initialState?: T): void;
  /**
   * Dispose ManagerClass from current scope.
   * Cleanup memory and delete all internal references.
   *
   * @param {TAnyContextManagerConstructor} ManagerClass - manager reference that should be unregistered from scope.
   */
  unRegisterService(ManagerClass: TAnyContextManagerConstructor): void;
  /**
   * Add observer to specified service.
   *
   * @param {TAnyContextManagerConstructor} ManagerClass - manager reference for observer addition.
   * @param {TUpdateObserver} serviceObserver - observer that should be notified on manager updates.
   */
  addServiceObserver(ManagerClass: TAnyContextManagerConstructor, serviceObserver: TUpdateObserver): void;
  /**
   * Remove observer from specified service.
   *
   * @param {TAnyContextManagerConstructor} ManagerClass - manager reference for observer removal.
   * @param {TUpdateObserver} serviceObserver - observer that should be removed from registry.
   */
  removeServiceObserver(ManagerClass: TAnyContextManagerConstructor, serviceObserver: TUpdateObserver): void;
  /**
   * Notify observers method that updates all providers state based on manager instance context.
   *
   * @param {ContextManager} manager - manager instance that should update subscribed providers.
   */
  notifyObservers<T>(manager: ContextManager<T>): void;
  /**
   * Subscribe to manager context updates.
   * Provided callback will be fired on every manager instance context update.
   *
   * @param {IContextManagerConstructor} ManagerClass - manager class reference for subscription.
   * @param {TUpdateSubscriber} subscriber - callback that will be triggered on context updates.
   * @returns {TCallable} un-subscriber function.
   */
  subscribeToManager<
    T extends TAnyObject,
    D extends IContextManagerConstructor<any, T>
    >(
    ManagerClass: D,
    subscriber: TUpdateSubscriber<T>
  ): TCallable;
  /**
   * Unsubscribe from manager context updates.
   *
   * @param {IContextManagerConstructor} ManagerClass - manager class reference for un-subscription.
   * @param {TUpdateSubscriber} subscriber - callback that should be removed from context updates subscription.
   */
  unsubscribeFromManager<
    T extends TAnyObject,
    D extends IContextManagerConstructor<any, T>
    >(
    ManagerClass: D,
    subscriber: TUpdateSubscriber<T>
  ): void;
}

/**
 * Current scope context.
 * Includes public methods to work with current scope.
 */
export interface IScopeContext {
  /**
   * Lib internals.
   * Should not be used normally except unit testing.
   */
  INTERNAL: IScopeContextInternals;
  /**
   * Emit signal for all subscribers in current dreamstate scope.
   *
   * @param {Object} base - base signal that should trigger signal event for subscribers.
   * @param {TSignalType} base.type - signal type.
   * @param {*=} base.data - signal data that will be received by subscribers.
   * @param {(TAnyContextManagerConstructor | null)=} emitter - signal emitter reference.
   * @returns {Promise} promise that resolves after all handlers execution.
   */
  emitSignal<D = undefined>(
    base: IBaseSignal<D>,
    emitter?: TAnyContextManagerConstructor | null
  ): ISignalEvent<D>;
  /**
   * Subscribe to signals in current scope.
   * Following callback will be triggered on each signal with signal event as first parameter.
   *
   * @param {TSignalListener} listener - signals listener callback.
   * @returns {TCallable} unsubscribing function.
   */
  subscribeToSignals<D = undefined>(
    listener: TSignalListener<D>
  ): TCallable;
  /**
   * Unsubscribe provided callback from signals in current scope.
   * Following callback will not be triggered on scope signals anymore.
   *
   * @param {TSignalListener} listener - signals listener callback.
   */
  unsubscribeFromSignals<D = undefined>(
    listener: TSignalListener<D>
  ): void;
  /**
   * Register callback as query provider and answer query data calls with it.
   *
   * @param {TQueryType} queryType - type of query for data provisioning.
   * @param {TQueryListener} listener - callback that will listen data queries and return evaluation data.
   * @returns {TCallable} function that unsubscribes provided callback.
   */
  registerQueryProvider<T extends TQueryType>(
    queryType: T,
    listener: TQueryListener<T, any>
  ): TCallable;
  /**
   * Unregister callback as query provider and answer query data calls with it.
   *
   * @param {TQueryType} queryType - type of query for data provisioning.
   * @param {TQueryListener} listener - callback that will be unsubscribed from listening.
   */
  unRegisterQueryProvider<T extends TQueryType>(
    queryType: T,
    listener: TQueryListener<T, any>
  ): void;
  /**
   * Query data from current scope in a sync way.
   * Handler that listen for provided query type will be executed and return value will be wrapped
   * and returned as QueryResponse.
   * Mainly used to get specific data in current context or receive current state of specific data without direct
   * referencing to it.
   *
   * @param {IOptionalQueryRequest} query - optional query request base for data retrieval, includes query type and
   *  optional data field.
   * @returns {TQueryResponse} response for provided query or null value if no handlers were found.
   */
  queryDataSync<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    query: Q
  ): TQueryResponse<any>;
  /**
   * Query data from current scope in an sync way.
   * Handler that listen for provided query type will be executed and return value will be wrapped
   * and returned as QueryResponse.
   * Mainly used to get specific data in current context or receive current state of specific data without direct
   * referencing to it.
   *
   * @param {IOptionalQueryRequest} query - optional query request base for data retrieval, includes query type and
   *  optional data field.
   * @returns {Promise} response for provided query or null value if no handlers were found.
   */
  queryDataAsync<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    query: Q
  ): Promise<TQueryResponse<any>>;
}

/**
 * React context reference for dreamstate scope wrapping of VDOM tree.
 */
export const ScopeContext: Context<IScopeContext> = createContext(null as any);
