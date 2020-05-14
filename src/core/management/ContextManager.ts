import { CONTEXT_STATES_REGISTRY } from "@Lib/core/internals";
import { ContextService } from "@Lib/core/management/ContextService";
import { notifyObservers } from "@Lib/core/observing/notifyObservers";
import { shouldObserversUpdate } from "@Lib/core/observing/shouldObserversUpdate";
import { getReactContext } from "@Lib/core/registry/getReactContext";
import { TConstructorKey, TDreamstateService, TPartialTransformer } from "@Lib/core/types";

import { debug } from "@Macro/debug.macro";

/**
 * Abstract class.
 * Class based context manager for react.
 * Current Issue: Static items inside of each class instance.
 */
export abstract class ContextManager<T extends object> extends ContextService {

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
    debug.info("Forcing context manager update:", this.constructor.name);
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
        CONTEXT_STATES_REGISTRY.get(this.constructor as TDreamstateService)!,
        nextContext
      )
    ) {
      debug.info("Updating context manager:", this.constructor.name);

      this.beforeUpdate(nextContext);
      this.context = nextContext;
      notifyObservers(this);
      this.afterUpdate(previousContext);
    } else {
      debug.info("Context manager update canceled, state is same:", this.constructor.name);
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
