import { Context } from "react";

import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { throwOutOfScope } from "@/dreamstate/core/error/throw";
import {
  QUERY_METADATA_SYMBOL,
  SCOPE_SYMBOL,
  SIGNAL_METADATA_SYMBOL,
  SIGNALING_HANDLER_SYMBOL,
} from "@/dreamstate/core/internals";
import { IScopeContext } from "@/dreamstate/core/scoping/ScopeContext";
import { getReactContext } from "@/dreamstate/core/services/getReactContext";
import { shouldObserversUpdate } from "@/dreamstate/core/services/shouldObserversUpdate";
import { processComputed } from "@/dreamstate/core/storing/processComputed";
import {
  EDreamstateErrorCode,
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
  TSignalType,
} from "@/dreamstate/types";
import { isFunction } from "@/dreamstate/utils/typechecking";

/**
 * Abstract context manager class.
 * Wraps data and logic part separately from react tree and allows to create global/local storages
 *   that have lifecycle and can be cleaned up and ejected when needed.
 *
 * To provide specific ContextManager classes in react tree check 'createProvider' method.
 * To consume specific ContextManager data in react tree check 'useManager' method.
 * To get more details about shallow check on context updates, see 'createNested', 'createActions' and other methods.
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
   * React context default value getter.
   * Used to provide placeholder values when manager is not provided.
   *
   * @returns {TAnyObject|null} returns default value for context consumers when manager is not provided.
   */
  public static getDefaultContext(): TAnyObject | null {
    return null;
  }

  /**
   * React context getter.
   * Method allows to get related React.Context for manual renders or testing.
   * Lazy initialization, even for static resolving before anything from ContextManager is used.
   */
  public static get REACT_CONTEXT(): Context<any> {
    if (this === ContextManager) {
      throw new DreamstateError(
        EDreamstateErrorCode.RESTRICTED_OPERATION,
        "Direct references to ContextManager statics forbidden."
      );
    }

    return getReactContext(this as TConstructorKey, this.getDefaultContext());
  }

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
   * Flag indicating whether current manager is still working or disposed.
   * Once manager is disposed, it cannot be reused or continue working.
   * Scope related methods (signals, queries) will not be visible, usage of scope related methods will throw exceptions.
   */
  public IS_DISPOSED: boolean = false;

  /**
   * Manager instance context.
   * Generic field that will be synchronized with react providers when 'setContext' method is called.
   * Should be object value.
   *
   * Manual nested values fields mutations are allowed, but not desired.
   * After calling setContext it will be shallow compared with already provided context before react tree syncing.
   * Meta fields created by dreamstate utils (createActions, createNested etc)
   *   may have different comparison instead of shallow check.
   *
   * If you need more details about shallow check, see 'createNested', 'createActions' and other methods.
   */
  public context: T = {} as T;

  /**
   * Generic context manager constructor.
   * Initial state can be used as some initialization value or SSR provided data.
   * Treating it as optional value can help to write more generic and re-usable code because manager can be
   * provided in a different place with different initial state.
   *
   * @param initialState - initial state received from dreamstate Provider component properties.
   */
  public constructor(initialState?: S) {
    /**
     * Make sure values marked as computed ('createComputed') are calculated before provision.
     */
    processComputed(this.context);
  }

  /**
   * Lifecycle method.
   * First provider was injected into react tree.
   * Same philosophy as 'componentWillMount' for class-based components.
   *
   * Useful for data initialization and subscriptions creation.
   */
  public onProvisionStarted(): void {}

  /**
   * Lifecycle method.
   * Last provider was removed from react tree.
   * Same philosophy as 'componentWillUnmount' for class-based components.
   *
   * Useful for data disposal when context is being ejected/when HMR happens.
   */
  public onProvisionEnded(): void {}

  /**
   * Get current manager scope.
   * Used to access current execution scope and some methods that allow getting manager instances in it.
   *
   * @returns {IScopeContext} returns manager scope.
   */
  public getScope(): IScopeContext {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL];
    } else {
      throwOutOfScope();
    }
  }

  /**
   * Forces update and render of subscribed components.
   * Just in case when you need forced update to keep everything in sync with your context.
   *
   * Side effect: after successful update all subscribed components will be updated accordingly to their subscription.
   *
   * Note: it will only force update of provider, components that use useManager selectors will not be forced to render.
   * Note: creates new shallow copy of 'this.context' reference after each call.
   * Note: if manager is out of scope, it will simply replace 'this.context'.
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
   * Update current context from partially supplied state or functional selector.
   * Updates react providers tree only if 'shouldObserversUpdate' check has passed and anything has changed in store.
   * Has same philosophy as 'setState' of react class components.
   *
   * Side effect: after successful update all subscribed components will be updated accordingly to their subscription.
   *
   * Note: partial context is needed or callback that returns partial context.
   * Note: it will only update provider, components that use useManager selectors will not be forced to render.
   * Note: if manager is out of scope, it just rewrites 'this.context' object without side effects.
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
   * Emit signal for other managers and subscribers in current scope.
   * Valid signal types: string, number, symbol.
   *
   * @throws {Error} - manager is out of scope.
   *
   * @param {Object} baseSignal - signal base that contains basic descriptor of emitting signal.
   * @param {TSignalType} baseSignal.type - signal type.
   * @param {*=} baseSignal.data - optional signal data.
   * @returns {Promise} promise that will be resolved after signal listeners call.
   */
  public emitSignal<D = undefined>(baseSignal: IBaseSignal<D>): ISignalEvent<D> {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL].emitSignal(baseSignal, this.constructor as TAnyContextManagerConstructor);
    } else {
      throwOutOfScope();
    }
  }

  /**
   * Send context query to retrieve data from query handler methods.
   * Async method is useful when provider is async. Sync providers still will be handled correctly.
   * Will return query response packed object in case if valid handler is found in scope.
   * Will return null in case if no valid handler found in current scope.
   *
   * @param {Object} queryRequest - query request base.
   * @param {TQueryType} queryRequest.type - query type.
   * @param {*=} queryRequest.data - optional query data, some kind of getter params.
   * @return {Promise<null | TQueryResponse<*>>} result of query search or null, if no providers in current scope.
   */
  public queryDataAsync<D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
    queryRequest: Q
  ): Promise<TQueryResponse<any>> {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL].queryDataAsync(queryRequest);
    } else {
      throwOutOfScope();
    }
  }

  /**
   * Send context query to retrieve data from query handler methods.
   * Sync method is useful when provider is sync. Async providers will return promise in a data field.
   * Will return query response packed object in case if valid handler is found in scope.
   * Will return null in case if no valid handler found in current scope.
   *
   * @param {Object} queryRequest - query request base.
   * @param {TQueryType} queryRequest.type - query type.
   * @param {*=} queryRequest.data - optional query data, some kind of getter params.
   * @return {null | TQueryResponse<*>} result of query search or null, if no providers in current scope.
   */
  public queryDataSync<D, T extends TQueryType, Q extends IOptionalQueryRequest<D, T>>(
    queryRequest: Q
  ): TQueryResponse<any> {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL].queryDataSync(queryRequest);
    } else {
      throwOutOfScope();
    }
  }
}
