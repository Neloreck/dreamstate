import { Context, createContext } from "react";

import { IRegistry } from "@/dreamstate/core/registry/createRegistry";
import { ContextManager } from "@/dreamstate/core/services/ContextManager";
import {
  IBaseSignal, IContextManagerConstructor, IOptionalQueryRequest,
  TAnyContextManagerConstructor, TAnyObject,
  TCallable,
  TQueryListener, TQueryResponse,
  TQueryType,
  TSignalListener,
  TSignalType, TUpdateObserver, TUpdateSubscriber
} from "@/dreamstate/types";

export interface IScopeContext {
  REGISTRY: IRegistry;
  registerService<T>(Service: TAnyContextManagerConstructor, initialState: T): void;
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
   * todo;
   */
  subscribeToManager<
    T extends TAnyObject,
    D extends IContextManagerConstructor<any, T>
    >(
    Manager: D,
    subscriber: TUpdateSubscriber<T>
  ): TCallable;
  /**
   * todo;
   */
  unsubscribeFromManager<
    T extends TAnyObject,
    D extends IContextManagerConstructor<any, T>
    >(
    Manager: D,
    subscriber: TUpdateSubscriber<T>
  ): void;
  /**
   * todo;
   */
  emitSignal<D = undefined, T extends TSignalType = TSignalType>(
    base: IBaseSignal<T, D>,
    emitter: TAnyContextManagerConstructor | null
  ): Promise<void>;
  subscribeToSignals<T extends TSignalType, D = undefined>(
    listener: TSignalListener<T, D>,
    registry: Set<TSignalListener<T, D>>
  ): TCallable;
  unsubscribeFromSignals<T extends TSignalType, D = undefined>(
    listener: TSignalListener<T, D>,
    registry: Set<TSignalListener<T, D>>
  ): void;
  registerQueryProvider<T extends TQueryType>(
    queryType: T,
    listener: TQueryListener<T, any>
  ): TCallable;
  unRegisterQueryProvider<T extends TQueryType>(
    queryType: T,
    listener: TQueryListener<T, any>
  ): void;
  queryDataSync<
    R,
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    query: Q
  ): TQueryResponse<R, T>;
  queryDataAsync<
    R,
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    queryRequest: Q
  ): Promise<TQueryResponse<R, T>>;
}

export interface IPublicScopeContext extends Pick<
  IScopeContext,
  "REGISTRY" |
  "emitSignal" |
  "subscribeToSignals" |
  "unsubscribeFromSignals" |
  "registerQueryProvider" |
  "unRegisterQueryProvider" |
  "queryDataAsync" |
  "queryDataSync"
  > {
}

export const ScopeContext: Context<IScopeContext> = createContext(null as any);
