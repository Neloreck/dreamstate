import { Context, createContext } from "react";

import { EMPTY_STRING, IDENTIFIER_KEY, MANAGER_REGEX, SIGNAL_LISTENER_KEY } from "./internals";
import {
  IContextManagerConstructor, IContextManagerSignalsResolver,
  TAnyContextManagerConstructor,
  TPartialTransformer,
  TSignalListener,
  TSignalType
} from "./types";
import { notifyObservers, shouldObserversUpdate } from "./observing";
import { STORE_REGISTRY } from "./registry";
import { emitSignal } from "./signals";

declare const IS_DEV: boolean;

/**
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<T extends object> {

  // Lazy initialization for IDENTIFIER KEY.
  public static get [IDENTIFIER_KEY](): any {
    const id: symbol = Symbol(IS_DEV ? this.name : "");

    // Lazy preparation of state and observers internal storage.
    STORE_REGISTRY.CONTEXT_STATES[id as any] = {};
    STORE_REGISTRY.CONTEXT_OBSERVERS[id as any] = new Set();

    Object.defineProperty(this, IDENTIFIER_KEY, { value: id, writable: false, configurable: false });

    return id;
  }

  /**
   * Should dreamstate destroy store instance after observers removal or preserve it for application lifespan.
   * Singleton objects will never be destroyed once created.
   * Non-singleton objects are destroyed if all observers are removed.
   */
  protected static IS_SINGLETON: boolean = false;

  /**
   * Setter method factory.
   * !Strictly typed generic method with 'update' lifecycle.
   * Helps to avoid boilerplate code with manual 'update' transactional updates for simple methods.
   */
  public static getSetter = <S extends object, D extends keyof S>(manager: ContextManager<S>, key: D) =>
    (next: Partial<S[D]> | TPartialTransformer<S[D]>): void => {
      if (IS_DEV) {
        if ((typeof next !== "function" && typeof next !== "object") || next === null) {
          console.warn(
            "If you want to update specific non-object state variable, use setContext instead. " +
            "Custom setters are intended to help with nested state objects. " +
            `State updater should be an object or a function. Supplied value type: ${typeof next}.`
          );
        }
      }

      return manager.setContext({
        [key]: Object.assign(
          {},
          manager.context[key],
          typeof next === "function" ? next(manager.context[key]) : next)
      } as any
      );
    };

  // todo: Solve typing problem here: Should we check undefined?

  /**
   * Get current provided manager.
   */
  public static current<S extends object, T extends ContextManager<S>>(
    this: IContextManagerConstructor<S> & { new(): T }
  ): T {
    return STORE_REGISTRY.MANAGERS[this[IDENTIFIER_KEY]] as T;
  }

  /**
   * Get current provided manager context.
   */
  public static currentContext<S extends object, T extends ContextManager<S>>(
    this: IContextManagerConstructor<S> & { new(): T }
  ): T["context"] {
    const manager: T = STORE_REGISTRY.MANAGERS[this[IDENTIFIER_KEY]] as T;

    return manager ? manager.context : undefined as any;
  }

  /**
   * Utility getter.
   * Lazy initialization, even for static resolving before anything from ContextManager is used.
   * Allows to get related React.Context for manual renders.
   */
  public static getContextType<T extends object>(): Context<T> {
    const reactContextType: Context<T> = createContext(null as any);

    if (IS_DEV) {
      reactContextType.displayName = "Dreamstate." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
    } else {
      reactContextType.displayName = "DS." + this.name.replace(MANAGER_REGEX, EMPTY_STRING);
    }

    Object.defineProperty(
      this,
      "getContextType",
      { value: function () { return reactContextType; }, writable: false, configurable: false }
    );

    return this.getContextType();
  }

  /**
   * Bound signal listener in private property.
   * Story it there for proper memory cleanup.
   * Do not modify original method descriptor and source class.
   */
  [SIGNAL_LISTENER_KEY]: IContextManagerSignalsResolver = {
    switcher: this.onSignal.bind(this),
    subscriber: this.onSignal.bind(this)
  };

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
      this.beforeUpdate(nextContext);
      this.context = nextContext;
      notifyObservers(this, nextContext);
      this.afterUpdate(previousContext);
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
   * Signals.
   */

  protected onSignal<D extends object>(type: TSignalType, data: D, emitter: ContextManager<any>) {
    /**
     * For inheritance.
     */
  }

  protected emitSignal<D extends object>(type: TSignalType, data: D): void {
    emitSignal(type, data, this);
  }

}
