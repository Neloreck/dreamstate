import { TConstructorKey, TDreamstateWorker, TPartialTransformer } from "../types";
import { CONTEXT_STATES_REGISTRY } from "../internals";
import { shouldObserversUpdate } from "../observing/shouldObserversUpdate";
import { notifyObservers } from "../observing/notifyObservers";
import { getReactContext } from "../registry/getReactContext";
import { ContextWorker } from "./ContextWorker";

import { log } from "../../build/macroses/log.macro";

/**
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<T extends object> extends ContextWorker {

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
    if (
      shouldObserversUpdate(
        CONTEXT_STATES_REGISTRY.get(this.constructor as TDreamstateWorker)!,
        nextContext
      )
    ) {
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
