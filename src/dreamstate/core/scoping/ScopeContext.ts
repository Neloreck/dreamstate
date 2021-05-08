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
  REGISTRY: IRegistry;
  registerService<T>(Service: TAnyContextManagerConstructor, initialState?: T): void;
  unRegisterService(Service: TAnyContextManagerConstructor): void;
  addServiceObserver(Service: TAnyContextManagerConstructor, serviceObserver: TUpdateObserver): void;
  removeServiceObserver(Service: TAnyContextManagerConstructor, serviceObserver: TUpdateObserver): void;
  /**
   * Start observing of service and trigger related lifecycle methods.
   * Count providers references so it will work with few different providers
   * and force 'onProvisionStarted' to be used only once.
   */
  incrementServiceObserving(Service: TAnyContextManagerConstructor): void;
  /**
   * Stop service observing.
   * Decrement counted references and trigger lifecycle if observing was ended.
   */
  decrementServiceObserving(Service: TAnyContextManagerConstructor): void;
  /**
   *
   */
  notifyObservers<T>(manager: ContextManager<T>): void;
  /**
   * Subscribe to manager context updates.
   * Returns unsubscriber function.
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
   * todo;
   */
  emitSignal<D = undefined, T extends TSignalType = TSignalType>(
    base: IBaseSignal<T, D>,
    emitter?: TAnyContextManagerConstructor | null
  ): Promise<void>;
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
  ): TQueryResponse<any, T>;
  /**
   * todo;
   */
  queryDataAsync<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    queryRequest: Q
  ): Promise<TQueryResponse<any, T>>;
}

/**
 * React context reference for dreamstate scope wrapping of VDOM tree.
 */
export const ScopeContext: Context<IScopeContext> = createContext(null as any);
