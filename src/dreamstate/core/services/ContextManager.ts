import { CONTEXT_STATES_REGISTRY } from "@/dreamstate/core/internals";
import { notifyObservers } from "@/dreamstate/core/observing/notifyObservers";
import { processComputed } from "@/dreamstate/core/observing/processComputed";
import { shouldObserversUpdate } from "@/dreamstate/core/observing/shouldObserversUpdate";
import { queryDataAsync } from "@/dreamstate/core/queries/queryDataAsync";
import { queryDataSync } from "@/dreamstate/core/queries/queryDataSync";
import { getReactContext } from "@/dreamstate/core/registry/getReactContext";
import { emitSignal } from "@/dreamstate/core/signals/emitSignal";
import {
  IBaseSignal, IOptionalQueryRequest, TAnyContextManagerConstructor,
  TAnyObject,
  TConstructorKey,
  TPartialTransformer, TQueryType,
  TSignalType
} from "@/dreamstate/types";

/**
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<
  T extends TAnyObject = TAnyObject,
  S extends TAnyObject = TAnyObject
> {

  /**
   * Lazy initialization, even for static resolving before anything from ContextManager is used.
   * Allows to get related React.Context for manual renders.
   */
  public static get REACT_CONTEXT() {
    if (this === ContextManager) {
      throw new Error("Cannot reference to ContextManager statics directly. Only inherited classes allowed.");
    }

    return getReactContext(this as TConstructorKey);
  }

  /**
   * Abstract store/actions bundle.
   */
  public context: T = {} as T;

  public constructor(initialState?: S) {
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
    return emitSignal(baseSignal, this.constructor as TAnyContextManagerConstructor);
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
  ) {
    return queryDataAsync<any, D, T, Q>(queryRequest);
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
  ) {
    return queryDataSync<any, D, T, Q>(queryRequest);
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
    notifyObservers(this);
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
        CONTEXT_STATES_REGISTRY.get(this.constructor as TAnyContextManagerConstructor)!,
        nextContext
      )
    ) {
      processComputed(nextContext);

      this.beforeUpdate(nextContext);
      this.context = nextContext;
      notifyObservers(this);
      this.afterUpdate(previousContext);
    } else {
      this.context = processComputed(nextContext);
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
