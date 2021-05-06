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
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<
  T extends TAnyObject = TEmptyObject,
  S extends TAnyObject = TAnyObject
> {

  public static readonly [SIGNAL_METADATA_SYMBOL]: TSignalSubscriptionMetadata;
  public static readonly [QUERY_METADATA_SYMBOL]: TQuerySubscriptionMetadata;

  public [SCOPE_SYMBOL]!: IScopeContext;
  public [SIGNALING_HANDLER_SYMBOL]!: TSignalListener;

  /**
   * Lazy initialization, even for static resolving before anything from ContextManager is used.
   * Allows to get related React.Context for manual renders.
   */
  public static get REACT_CONTEXT() {
    return getReactContext(this as TConstructorKey);
  }

  /**
   * Abstract store/actions bundle.
   */
  public context: T = {} as T;

  public constructor(initialState?: S) {
    processComputed(this.context);
  }

  /**
   * Lifecycle.
   * First provider was injected into DOM.
   */
  protected onProvisionStarted(): void {}

  /**
   * Lifecycle.
   * Last provider was removed from DOM.
   */
  protected onProvisionEnded(): void {}

  /**
   * Emit signal for other managers and subscribers.
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

  /*
   * Store related lifecycle.
   */

  /**
   * Forces update and render of subscribed components.
   * Just in case when you need forced update to keep everything in sync with your context.
   */
  public forceUpdate(): void {
    // Update computed values if something was updated manually.
    processComputed(this.context);
    // Force updates and common lifecycle with same params.
    this.beforeUpdate(this.context);
    this.context = Object.assign({}, this.context);
    this[SCOPE_SYMBOL].notifyObservers(this);
    this.afterUpdate(this.context);
  }

  /**
   * Update current context from partially supplied state.
   * Calls lifecycle methods.
   */
  public setContext(next: Partial<T> | TPartialTransformer<T>): void {
    const previousContext: T = this.context;
    const nextContext: T = Object.assign(
      {},
      previousContext,
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
   * Lifecycle.
   * Before update lifecycle event.
   * Also shared for 'getSetter' methods.
   */
  protected beforeUpdate(nextContext: T): void {}

  /**
   * Lifecycle.
   * After update lifecycle event.
   * Also shared for 'getSetter' methods.
   */
  protected afterUpdate(previousContext: T): void {}

}
