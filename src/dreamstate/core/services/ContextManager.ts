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
import {
  IBaseSignal,
  IOptionalQueryRequest,
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
 *   Examples: AuthContextManager, GraphicsContextManager, ChatContextManager, LocalMediaContextManager etc.
 */
export abstract class ContextManager<
  T extends TAnyObject = TEmptyObject,
  S extends TAnyObject = TAnyObject
> {

  /**
   * Signal handling metadata that contains OnSignal descriptors information.
   */
  public static readonly [SIGNAL_METADATA_SYMBOL]: TSignalSubscriptionMetadata;
  /**
   * Query handling metadata that contains OnQuery descriptors information.
   */
  public static readonly [QUERY_METADATA_SYMBOL]: TQuerySubscriptionMetadata;

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
   * Method allows to get related React.Context for manual renders or testing.
   * Lazy initialization, even for static resolving before anything from ContextManager is used.
   */
  public static get REACT_CONTEXT() {
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
  protected onProvisionStarted(): void {}

  /**
   * Lifecycle method.
   * Last provider was removed from react tree.
   * Same logic as 'componentWillUnmount' for class-based components.
   *
   * Useful for data disposal when context is being ejected/when HMR happens.
   */
  protected onProvisionEnded(): void {}

  /**
   * Emit signal for other managers and subscribers in  current scope.
   *
   * @param {Object} baseSignal - signal base that contains basic descriptor of emitting signal.
   * @param {TSignalType} baseSignal.type - signal type.
   * @param {*=} baseSignal.data - optional signal data.
   *
   * @return {Promise} promise that will be resolved after signal listeners call.
   *   Note: async handlers will not be awaited.
   */
  protected emitSignal<T extends TSignalType = TSignalType, D = undefined>(
    baseSignal: IBaseSignal<T, D>
  ): Promise<void> {
    return this[SCOPE_SYMBOL].emitSignal(baseSignal, this.constructor as TAnyContextManagerConstructor);
  }

  /**
   * Send context query to retrieve data from @OnQuery method with required types.
   */
  protected queryDataAsync<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    queryRequest: Q
  ): Promise<TQueryResponse<any, T>> {
    return this[SCOPE_SYMBOL].queryDataAsync(queryRequest);
  }

  /**
   * Send sync context query to retrieve data from @OnQuery method with required types.
   */
  protected queryDataSync<
    D extends any,
    T extends TQueryType,
    Q extends IOptionalQueryRequest<D, T>
    >(
    queryRequest: Q
  ): TQueryResponse<any, T> {
    return this[SCOPE_SYMBOL].queryDataSync(queryRequest);
  }

  /**
   * Forces update and render of subscribed components.
   * Just in case when you need forced update to keep everything in sync with your context.
   *
   * Note: creates new shallow copy of 'this.context' reference.
   */
  public forceUpdate(): void {
    const previousContext: T = this.context;
    const nextContext: T = Object.assign({}, this.context);

    processComputed(nextContext);

    this.beforeUpdate(nextContext);
    this.context = nextContext;
    this[SCOPE_SYMBOL].notifyObservers(this);
    this.afterUpdate(previousContext);
  }

  /**
   * Update current context from partially supplied state.
   * Updates react providers tree only if 'shouldObserversUpdate' check has passed and anything has changed in store.
   *
   * @param {Object|Function} next - part of context that should be updated or context transformer function.
   *   In case of functional callback, it will be executed immediately with 'currentContext' parameter.
   */
  public setContext(next: Partial<T> | TPartialTransformer<T>): void {
    const previousContext: T = this.context;
    const nextContext: T = Object.assign(
      {},
      previousContext,
      /**
       * Handle context transformer functions.
       */
      typeof next === "function" ? next(previousContext) : next
    );

    /**
     * Compare current context with saved for observing one.
     */
    if (
      shouldObserversUpdate(
        this[SCOPE_SYMBOL].REGISTRY.CONTEXT_STATES_REGISTRY.get(this.constructor as TAnyContextManagerConstructor)!,
        nextContext
      )
    ) {
      processComputed(nextContext);

      this.beforeUpdate(nextContext);
      this.context = nextContext;
      this[SCOPE_SYMBOL].notifyObservers(this);
      this.afterUpdate(previousContext);
    }
  }

  /**
   * Lifecycle method.
   * Before update lifecycle event.
   *
   * Following method will be called if providers tree update is about to happen.
   *
   * @param nextContext - nextContext that will be set for data provisioning and assigned to this.context later.
   */
  protected beforeUpdate(nextContext: T): void {}

  /**
   * Lifecycle method.
   * After update lifecycle event.
   *
   * Following method will be called if providers tree update is about to happen.
   *
   * @param previousContext - previousContext that was set for data provisioning and assigned to this.context before.
   */
  protected afterUpdate(previousContext: T): void {}

}
