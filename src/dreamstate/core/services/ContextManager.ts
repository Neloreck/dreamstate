import { Context } from "react";

import {
  QUERY_METADATA_SYMBOL,
  SCOPE_SYMBOL,
  SIGNAL_METADATA_SYMBOL,
  SIGNALING_HANDLER_SYMBOL
} from "@/dreamstate/core/internals";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { getReactContext } from "@/dreamstate/core/services/getReactContext";
import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import { throwOutOfScope } from "@/dreamstate/core/utils/throwOutOfScope";
import {
  IBaseSignal,
  IOptionalQueryRequest,
  ISignalEvent,
  TAnyContextManagerConstructor,
  TAnyObject,
  TConstructorKey,
  TEmptyObject,
  TPartialTransformer,
  TQueryResponse,
  TQuerySubscriptionMetadata,
  TQueryType,
  TSignalListener,
  TSignalSubscriptionMetadata,
  TSignalType
} from "@/dreamstate/types";
import { isFunction } from "@/dreamstate/utils/typechecking";

/**
 * Abstract context manager class.
 * Wraps data and logic part separately from react tree and allows to create global/local storages
 *   that have lifecycle and can be cleaned up and ejected when needed.
 *
 * To provide specific ContextManager classes in react tree check 'createProvider' method.
 * To consume specific ContextManager data in react tree check 'useManager' method.
 *
 * Every class instance is created automatically by dreamstate scope if provision is needed.
 * Every class instance can emit signals/query data in scope where it was created.
 * Every class instance can register method as scope signal listener.
 * Every class instance can register method as scope query data provider.
 * Every class instance is responsible only for specific data part like reducer in redux.
 *   Examples: AuthManager, GraphicsManager, ChatManager, LocalMediaManager etc.
 *
 * Async methods called after manager class unregistering will cause dev warnings and will not affect actual scope.
 */
export abstract class ContextManager<T extends TAnyObject = TEmptyObject, S extends TAnyObject = TAnyObject> {

  /**
   * Flag indicating whether current manager is still working or disposed.
   * Once manager is disposed, it cannot be reused or continue working.
   */
  public IS_DISPOSED: boolean = false;

  /**
   * Manager instance scope reference.
   * Used internally to emit signals/queries or subscribe to data.
   */
  public [SCOPE_SYMBOL]!: IScopeContext;
  /**
   * Signaling handler that operates scope signals and calls required method registered in metadata.
   */
  public [SIGNALING_HANDLER_SYMBOL]!: TSignalListener;

  /**
   * Manager instance signals metadata reference.
   * Used internally to emit signals with instance based description.
   */
  public [SIGNAL_METADATA_SYMBOL]!: TSignalSubscriptionMetadata;
  /**  /**
   * Manager instance signals metadata reference.
   * Used internally to emit signals with instance based description.
   */
  public [QUERY_METADATA_SYMBOL]!: TQuerySubscriptionMetadata;

  /**
   * Method allows to get related React.Context for manual renders or testing.
   * Lazy initialization, even for static resolving before anything from ContextManager is used.
   */
  public static get REACT_CONTEXT(): Context<any> {
    if (this === ContextManager) {
      throw new Error("Cannot reference to ContextManager statics directly. Only inherited classes allowed.");
    }

    return getReactContext(this as TConstructorKey);
  }

  /**
   * Manager instance context.
   * Generic field that will be synchronized with react providers when 'setContext' method is called.
   */
  public context: T = {} as T;

  /**
   * Generic context manager constructor.
   *
   * @param initialState - initial state received from dreamstate Provider component properties.
   *   Can be useful with external data provision or server side rendering.
   */
  public constructor(initialState?: S) {
    processComputed(this.context);
  }

  /**
   * Lifecycle method.
   * First provider was injected into react tree.
   * Same logic as 'componentWillMount' for class-based components.
   *
   * Useful for data initialization and subscriptions creation.
   */
  public onProvisionStarted(): void {}

  /**
   * Lifecycle method.
   * Last provider was removed from react tree.
   * Same logic as 'componentWillUnmount' for class-based components.
   *
   * Useful for data disposal when context is being ejected/when HMR happens.
   */
  public onProvisionEnded(): void {}

  /**
   * Forces update and render of subscribed components.
   * Just in case when you need forced update to keep everything in sync with your context.
   *
   * Note: creates new shallow copy of 'this.context' reference.
   */
  public forceUpdate(): void {
    /**
     * Always do shallow copy to point new ref object in current context.
     */
    this.context = processComputed(Object.assign({}, this.context));

    if (this[SCOPE_SYMBOL]) {
      this[SCOPE_SYMBOL].INTERNAL.notifyObservers(this);
    }
  }

  /**
   * Update current context from partially supplied state.
   * Updates react providers tree only if 'shouldObserversUpdate' check has passed and anything has changed in store.
   *
   * @param {Object|Function} next - part of context that should be updated or context transformer function.
   *   In case of functional callback, it will be executed immediately with 'currentContext' parameter.
   */
  public setContext(next: Partial<T> | TPartialTransformer<T>): void {
    const nextContext: T = Object.assign(
      {},
      this.context,
      /**
       * Handle context transformer functions.
       */
      isFunction(next) ? (next as TPartialTransformer<T>)(this.context) : next
    );

    /**
     * Always update context, even if it was created out of scope.
     * In case of existing scope just send additional notification.
     */
    this.context = processComputed(nextContext);

    /**
     * Compare current context with saved for observing one.
     */
    if (
      this[SCOPE_SYMBOL] &&
      shouldObserversUpdate(
        this[SCOPE_SYMBOL].INTERNAL.REGISTRY.CONTEXT_STATES_REGISTRY.get(
          this.constructor as TAnyContextManagerConstructor
        )!,
        nextContext
      )
    ) {
      this[SCOPE_SYMBOL].INTERNAL.notifyObservers(this);
    }
  }

  /**
   * Emit signal for other managers and subscribers in  current scope.
   *
   * @param {Object} baseSignal - signal base that contains basic descriptor of emitting signal.
   * @param {TSignalType} baseSignal.type - signal type.
   * @param {*=} baseSignal.data - optional signal data.
   * @returns {Promise} promise that will be resolved after signal listeners call.
   *   Note: async handlers will not be awaited.
   */
  public emitSignal<D = undefined>(baseSignal: IBaseSignal<D>): ISignalEvent<D> {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL].emitSignal(baseSignal, this.constructor as TAnyContextManagerConstructor);
    } else {
      throwOutOfScope();
    }
  }

  /**
   * Send context query to retrieve data from @OnQuery method with required types.
   */
  public queryDataAsync<D extends any, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
    queryRequest: Q
  ): Promise<TQueryResponse<any>> {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL].queryDataAsync(queryRequest);
    } else {
      throwOutOfScope();
    }
  }

  /**
   * Send sync context query to retrieve data from @OnQuery method with required types.
   */
  public queryDataSync<D extends any, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
    queryRequest: Q
  ): TQueryResponse<any> {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL].queryDataSync(queryRequest);
    } else {
      throwOutOfScope();
    }
  }

}
