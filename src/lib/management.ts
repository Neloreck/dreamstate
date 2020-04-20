import { Context, createContext } from "react";

import {
  EMPTY_STRING,
  IDENTIFIER_KEY,
  MANAGER_REGEX,
  SIGNAL_LISTENER_KEY,
  CONTEXT_MANAGERS_SIGNAL_LISTENERS_REGISTRY,
  CONTEXT_OBSERVERS_REGISTRY,
  CONTEXT_STATES_REGISTRY,
  CONTEXT_SUBSCRIBERS_REGISTRY
} from "./internals";
import {
  ISignal,
  TPartialTransformer,
  TSignalListener,
  TSignalType
} from "./types";
import { notifyObservers, shouldObserversUpdate } from "./observing";
import { emitSignal, onMetadataListenerCalled } from "./signals";

import { log } from "../macroses/log.macro";

declare const IS_DEV: boolean;

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
    const reactContext: Context<any> = createContext(null as any); // todo: Correct typing for get accessors?

    if (IS_DEV) {
      reactContext.displayName = "Dreamstate." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
    } else {
      reactContext.displayName = "DS." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
    }

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
    const id: symbol = Symbol(IS_DEV ? this.name : "");

    // Lazy preparation of state and observers internal storage.
    CONTEXT_STATES_REGISTRY[id as any] = {};
    CONTEXT_OBSERVERS_REGISTRY[id as any] = new Set();
    CONTEXT_SUBSCRIBERS_REGISTRY[id as any] = new Set();
    CONTEXT_MANAGERS_SIGNAL_LISTENERS_REGISTRY[id as any] = [];

    Object.defineProperty(this, IDENTIFIER_KEY, { value: id, writable: false, configurable: false });

    log.info("Context manager id defined:", this.name, id);

    return id;
  }

  /**
   * Bound signal listener in private property.
   */
  public [SIGNAL_LISTENER_KEY]: TSignalListener<TSignalType, any> = onMetadataListenerCalled.bind(this);

  /**
   * Abstract store/actions bundle.
   * Left for generic implementation.
   */
  public abstract context: T;

  /**
   * Force React.Provider update.
   * Calls lifecycle methods.
   */
  public forceUpdate(): void {
    log.info("Forcing context manager update:", this.constructor.name);
    // Force updates and common lifecycle with same params.
    this.beforeUpdate(this.context);
    this.context = Object.assign({}, this.context);
    notifyObservers(this, this.context);
    this.afterUpdate(this.context);
  }

  /**
   * Update current context from partially supplied state.
   * Calls lifecycle methods.
   */
  public setContext(next: Partial<T> | TPartialTransformer<T>): void {
    if (IS_DEV) {
      if ((typeof next !== "function" && typeof next !== "object") || next === null) {
        console.warn("Seems like wrong prop was supplied to the 'setContext' method. Context state updater " +
          "should be an object or a function. Supplied value type:", typeof next);
      }
    }

    const previousContext: T = this.context;
    const nextContext: T = Object.assign(
      {},
      previousContext,
      typeof next === "function" ? next(previousContext) : next
    );

    if (shouldObserversUpdate(this, nextContext)) {
      log.info("Updating context manager:", this.constructor.name);

      this.beforeUpdate(nextContext);
      this.context = nextContext;
      notifyObservers(this, nextContext);
      this.afterUpdate(previousContext);
    } else {
      log.info("Context manager update cancelled, state is same:", this.constructor.name);
    }
  }

  /**
   * Lifecycle.
   * First provider was injected into DOM.
   */
  protected onProvisionStarted(): void {
    /**
     * For inheritance.
     */
  }

  /**
   * Lifecycle.
   * Last provider was removed from DOM.
   */
  protected onProvisionEnded(): void {
    /**
     * For inheritance.
     */
  }

  /**
   * Lifecycle.
   * Before update lifecycle event.
   * Also shared for 'getSetter' methods.
   */
  protected beforeUpdate(nextContext: T): void {
    /**
     * For inheritance.
     */
  }

  /**
   * Lifecycle.
   * After update lifecycle event.
   * Also shared for 'getSetter' methods.
   */
  protected afterUpdate(previousContext: T): void {
    /**
     * For inheritance.
     */
  }

  /**
   * Emit signal for other managers and subscribers.
   */
  protected emitSignal<D = undefined, T extends TSignalType = TSignalType>(baseSignal: ISignal<D, T>): void {
    log.info("Context manager emitting signal:", this.constructor.name, baseSignal);

    emitSignal(baseSignal, this);
  }

}
