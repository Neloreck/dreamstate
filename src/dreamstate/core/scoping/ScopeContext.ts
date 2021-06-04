import { Context, createContext } from "react";

import { IRegistry } from "@/dreamstate/core/scoping/registry/createRegistry";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  IBaseSignal,
  IContextManagerConstructor,
  IOptionalQueryRequest,
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
   * Start observing of service and trigger related lifecycle methods.
   * Count providers references so it will work with few different providers
   * and force 'onProvisionStarted' to be used only once.
   *
   * @param {TAnyContextManagerConstructor} ManagerClass - manager reference for references increment.
   */
  incrementServiceObserving(ManagerClass: TAnyContextManagerConstructor): void;
  /**
   * Stop service observing.
   * Decrement counted references and trigger lifecycle if observing was ended.
   *
   * @param {TAnyContextManagerConstructor} ManagerClass - manager reference for references decrement.
   */
  decrementServiceObserving(ManagerClass: TAnyContextManagerConstructor): void;
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
  emitSignal<D = undefined, T extends TSignalType = TSignalType>(
    base: IBaseSignal<T, D>,
    emitter?: TAnyContextManagerConstructor | null
  ): void;
  /**
   * todo;
   */
  subscribeToSignals<T extends TSignalType, D = undefined>(
    listener: TSignalListener<T, D>
  ): TCallable;
  /**
   * todo;
   */
  unsubscribeFromSignals<T extends TSignalType, D = undefined>(
    listener: TSignalListener<T, D>
  ): void;
  /**
   * todo;
   */
  registerQueryProvider<T extends TQueryType>(
    queryType: T,
    listener: TQueryListener<T, any>
  ): TCallable;
  /**
   * todo;
   */
  unRegisterQueryProvider<T extends TQueryType>(
    queryType: T,
    listener: TQueryListener<T, any>
  ): void;
  /**
   * todo;
   */
  queryDataSync<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    query: Q
  ): TQueryResponse<any>;
  /**
   * todo;
   */
  queryDataAsync<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    queryRequest: Q
  ): Promise<TQueryResponse<any>>;
}

/**
 * React context reference for dreamstate scope wrapping of VDOM tree.
 */
export const ScopeContext: Context<IScopeContext> = createContext(null as any);
