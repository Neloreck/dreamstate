import { Context, createContext } from "react";

import { CONTEXT_STATES_REGISTRY, EMPTY_STRING, IDENTIFIER_KEY, MANAGER_REGEX } from "../internals";
import {
  IContextManagerConstructor,
  IQueryRequest,
  IQueryResponse,
  ISignal,
  TAnyContextManagerConstructor,
  TPartialTransformer,
  TQueryType,
  TSignalType
} from "../types";
import { notifyObservers, shouldObserversUpdate } from "../observing";
import { emitSignal } from "../signals";
import { sendQuery } from "../queries";
import { createManagerId } from "../registry";

import { log } from "../../build/macroses/log.macro";

/**
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<T extends object> {

  /**
   * Should dreamstate destroy store instance after observers removal or preserve it for application lifespan.
   * Singleton objects will never be destroyed once created.
   * Non-singleton objects are destroyed if all observers are removed.
   */
  protected static IS_SINGLE: boolean = false;

  /**
   * Lazy initialization, even for static resolving before anything from ContextManager is used.
   * Allows to get related React.Context for manual renders.
   */
  public static get REACT_CONTEXT() {
    const reactContext: Context<any> = createContext(null as any);

    reactContext.displayName = "DS." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);

    log.info("Context manager context declared:", this.name, reactContext.displayName);

    Object.defineProperty(
      this,
      "REACT_CONTEXT",
      { value: reactContext, writable: false, configurable: false }
    );

    return reactContext;
  }

  /*
   * Internal.
   * Lazy initialization for IDENTIFIER KEY and manager related registry.
   */
  public static get [IDENTIFIER_KEY](): symbol {
    const id: symbol = createManagerId("");

    Object.defineProperty(this, IDENTIFIER_KEY, { value: id, writable: false, configurable: false });

    return id;
  }

  /**
   * Abstract store/actions bundle.
   */
  public abstract context: T;

  /**
   * Forces update and render of subscribed components.
   */
  public forceUpdate(): void {
    log.info("Forcing context manager update:", this.constructor.name);
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
    if (shouldObserversUpdate(
      CONTEXT_STATES_REGISTRY[(this.constructor as IContextManagerConstructor<T>)[IDENTIFIER_KEY]], nextContext
    )) {
      log.info("Updating context manager:", this.constructor.name);

      this.beforeUpdate(nextContext);
      this.context = nextContext;
      notifyObservers(this);
      this.afterUpdate(previousContext);
    } else {
      log.info("Context manager update cancelled, state is same:", this.constructor.name);
    }
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

  /**
   * Emit signal for other managers and subscribers.
   */
  protected emitSignal<D = undefined, T extends TSignalType = TSignalType>(baseSignal: ISignal<D, T>): void {
    log.info("Context manager emitting signal:", this.constructor.name, baseSignal);

    emitSignal(baseSignal, this);
  }

  protected sendQuery<R, D = undefined, T extends TQueryType = TQueryType>(
    queryRequest: { type: T; data?: D }
  ): Promise<IQueryResponse<R, T> | null> {
    log.info("Context manager sending query:", this.constructor.name, queryRequest);

    return sendQuery(
      queryRequest as IQueryRequest<D, T>,
      (this.constructor as TAnyContextManagerConstructor)[IDENTIFIER_KEY]
    );
  }

}
