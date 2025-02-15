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
} from "@/dreamstate/types";
import { isFunction } from "@/dreamstate/utils/typechecking";

/**
 * Abstract context manager class.
 * This class wraps data and logic, separating them from the React tree. It allows you to create
 * global or local storages with lifecycles, which can be cleaned up and ejected when no longer needed.
 *
 * This class serves as a foundation for managing scoped data and logic in a React application using
 * the Dreamstate library.
 *
 * To provide specific `ContextManager` classes in the React tree, use the `createProvider` method.
 * To consume specific `ContextManager` data, use the `useManager` method.
 * For more details on shallow checks of context updates, see the `createNested`, `createActions`,
 * and other related methods.
 *
 * Every instance of this class is automatically managed and created by Dreamstate scope if needed.
 * - Instances can emit signals and query data within the scope where they were created.
 * - Instances can register methods as scope signal listeners or query data providers.
 * - Each instance is responsible for a specific data part (similar to reducers in Redux).
 *
 * Examples of `ContextManager` subclasses: AuthManager, GraphicsManager, ChatManager, LocalMediaManager, etc.
 *
 * **Important Notes**:
 * - Async methods called after the manager class is unregistered will trigger warnings during development,
 *   but they will not affect the actual scope after ejection.
 *
 *  @template T - The type of the context state managed by this class.
 *  @template S - The type of additional data or metadata that can be attached to the manager.
 */
export abstract class ContextManager<T extends TAnyObject = TEmptyObject, S extends TAnyObject = TAnyObject> {
  /**
   * React context default value getter.
   * This method provides placeholder values to context consumers when the corresponding manager is not provided.
   *
   * @returns {TAnyObject | null}
   * - Returns the default value for context consumers when the manager is not provided.
   * - Defaults to `null` if no specific getter is defined.
   */
  public static getDefaultContext(): TAnyObject | null {
    return null;
  }

  /**
   * React context getter.
   * This method allows access to the related React.Context, which can be useful for manual rendering
   * or testing scenarios.
   *
   * The context is lazily initialized, even for static resolving, before any other elements of the
   * ContextManager are used.
   *
   * @returns {Context<any>} The React context associated with this ContextManager.
   */
  public static get REACT_CONTEXT(): Context<any> {
    if (this === ContextManager) {
      throw new DreamstateError(
        EDreamstateErrorCode.RESTRICTED_OPERATION,
        "Direct references to ContextManager statics forbidden."
      );
    }

    // todo: Do not call get default context every time, provide only `this` parameter.
    return getReactContext(this as TConstructorKey, this.getDefaultContext());
  }

  /**
   * Manager instance scope reference.
   * Used internally to emit signals/queries or subscribe to data within the current scope.
   */
  public [SCOPE_SYMBOL]!: IScopeContext;

  /**
   * Signaling handler that operates on scope signals and calls the required method
   * registered in metadata to handle the signal event.
   */
  public [SIGNALING_HANDLER_SYMBOL]!: TSignalListener;

  /**
   * Manager instance signals metadata reference.
   * Used internally to emit signals, providing instance-based metadata description for the signals.
   */
  public [SIGNAL_METADATA_SYMBOL]!: TSignalSubscriptionMetadata;

  /**
   * Manager instance query metadata reference.
   * Used internally to emit queries, providing instance-based metadata description for the queries.
   */
  public [QUERY_METADATA_SYMBOL]!: TQuerySubscriptionMetadata;

  /**
   * Flag indicating whether the current manager is still active or has been disposed.
   * Once a manager is disposed, it cannot be reused or continue functioning.
   * Scope-related methods (signals, queries) will be inaccessible, and using them will throw exceptions.
   */
  public IS_DISPOSED: boolean = false;

  /**
   * Manager instance context.
   * This field will be synchronized with React providers when the 'setContext' method is called.
   * It should hold an object value.
   *
   * While manual mutations of nested value fields are allowed, they are not recommended.
   * After calling 'setContext', the context will be shallowly compared with the existing context
   * before it is synced with the React tree.
   * Meta fields created by Dreamstate utilities (such as createActions, createNested, etc.) may
   * have a different comparison mechanism instead of the standard shallow check.
   *
   * For more information about the shallow check process, refer to 'createNested', 'createActions',
   * and similar methods.
   */
  public context: T = {} as T;

  /**
   * Generic context manager constructor.
   * The initial state can be used as an initialization value or SSR-provided data.
   * Treating the initial state as an optional value allows for more generic and reusable code,
   * as the manager can be provided in different places with different initial states.
   *
   * @template S - The type of initial state object.
   * @param {S} initialState - Optional initial state received from the Dreamstate Provider component properties.
   */
  public constructor(initialState?: S) {
    /*
     * Make sure values marked as computed ('createComputed') are calculated before provision.
     */
    processComputed(this.context);
  }

  /**
   * Lifecycle method called when the first provider is injected into the React tree.
   * This follows a similar philosophy to 'componentWillMount' in class-based components.
   *
   * This method is useful for initializing data and setting up subscriptions.
   */
  public onProvisionStarted(): void {}

  /**
   * Lifecycle method called when the last provider is removed from the React tree.
   * This follows a similar philosophy to 'componentWillUnmount' in class-based components.
   *
   * This method is useful for disposing of data when the context is being ejected
   * or when Hot Module Replacement (HMR) occurs.
   */
  public onProvisionEnded(): void {}

  /**
   * Get the current manager scope.
   * This method allows access to the current execution scope and provides methods
   * for retrieving manager instances within it.
   *
   * @returns {IScopeContext} The current manager scope.
   */
  public getScope(): IScopeContext {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL];
    } else {
      throwOutOfScope();
    }
  }

  /**
   * Forces an update and re-render of subscribed components.
   * This is useful when you need to ensure that the components remain in sync with the current context.
   *
   * Side effect: After a successful update, all subscribed components will be re-rendered
   * according to their subscription.
   *
   * Note: This will only force an update of the provider; components using `useManager` selectors
   * will not be forced to render.
   *
   * Note: A new shallow copy of `this.context` is created after each call.
   *
   * Note: If the manager is out of scope, the method will simply replace `this.context`.
   */
  public forceUpdate(): void {
    /*
     * Always do shallow copy to point new ref object in current context.
     */
    this.context = processComputed(Object.assign({}, this.context));

    if (this[SCOPE_SYMBOL]) {
      this[SCOPE_SYMBOL].INTERNAL.notifyObservers(this);
    }
  }

  /**
   * Updates the current context from a partially supplied state or a functional selector.
   * The update is applied to the React provider tree only if the `shouldObserversUpdate` check passes
   * and if any changes have occurred in the store.
   * This follows the same philosophy as `setState` in React class components.
   *
   * Side effect: After a successful update, all subscribed components will be updated accordingly
   * to their subscription.
   *
   * Note: A partial context object or a callback that returns a partial context is required.
   *
   * Note: This will only update the provider; components using `useManager` selectors will not be
   * forced to render.
   *
   * Note: If the manager is out of scope, it will simply rewrite the `this.context` object without
   * any side effects.
   *
   * @param {object | Function} next - A part of the context to be updated or a context transformer function.
   *   If a function is provided, it will be executed immediately with the `currentContext` as its parameter.
   */
  public setContext(next: Partial<T> | TPartialTransformer<T>): void {
    const nextContext: T = Object.assign(
      {},
      this.context,
      /*
       * Handle context transformer functions.
       */
      isFunction(next) ? (next as TPartialTransformer<T>)(this.context) : next
    );

    /*
     * Always update context, even if it was created out of scope.
     * In case of existing scope just send additional notification.
     */
    this.context = processComputed(nextContext);

    /*
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
   * Emits a signal to other managers and subscribers within the current scope.
   * Valid signal types include `string`, `number`, and `symbol`.
   *
   * @template D - The type of the data associated with the signal.
   * @param {IBaseSignal<D>} baseSignal - The base signal object containing a signal type and
   *   optional data.
   * @param {*} baseSignal.data - Optional data associated with the signal.
   * @returns {ISignalEvent<D>} The signal event object that encapsulates the emitted signal.
   *
   * @throws {Error} Throws an error if the manager is out of scope.
   */
  public emitSignal<D = undefined>(baseSignal: IBaseSignal<D>): ISignalEvent<D> {
    if (this[SCOPE_SYMBOL]) {
      return this[SCOPE_SYMBOL].emitSignal(baseSignal, this.constructor as TAnyContextManagerConstructor);
    } else {
      throwOutOfScope();
    }
  }

  /**
   * Sends a context query to retrieve data from query handler methods.
   * This asynchronous method is particularly useful for async providers, although
   * synchronous providers are handled as well.
   *
   * If a valid query handler is found in the current scope, it returns a promise that resolves
   * with a query response object; otherwise, it resolves with `null`.
   *
   * @template D - The type of the query data.
   * @template T - The type of the query.
   * @template Q - The query request type, extending IOptionalQueryRequest<D, T>.
   * @param {Q} queryRequest - The query request object containing the query type and optional data.
   * @param {TQueryType} queryRequest.type - The type of the query.
   * @param {*} [queryRequest.data] - Optional data used as parameters for data retrieval.
   * @returns {Promise<TQueryResponse<any> | null>} A promise that resolves with the query response if a valid
   *   handler is found, or `null` if no handler exists in the current scope.
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
   * Sends a context query to retrieve data from query handler methods synchronously.
   * This method is ideal for synchronous operations; asynchronous handlers will return a promise
   * in the data field.
   *
   * If a valid query handler is found in the current scope, the method returns a query response object.
   * Otherwise, it returns `null`.
   *
   * @template D - The type of the query data.
   * @template T - The type of the query.
   * @template Q - The type of the query request, extending IOptionalQueryRequest<D, T>.
   * @param {Q} queryRequest - The query request object containing:
   *   - `type`: The type of the query.
   *   - `data` (optional): Additional data or parameters for data retrieval.
   * @returns {TQueryResponse<any> | null} The query response object if a valid handler is found,
   *   or `null` if no handler exists in the current scope.
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
