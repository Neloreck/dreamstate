import { ILoadable, MethodDescriptor, TMutable, TPartialTransformer } from "./types";
import { MUTABLE_KEY } from "./internals";
import { ContextManager } from "./management";

import { log } from "../macroses/log.macro";

declare const IS_DEV: boolean;

/**
 * Create loadable value utility.
 * todo: Think about size impact of this utils and how to reuse some code.
 */
export function createLoadable<T, E>(initialValue: T | null = null): ILoadable<T, E> {
  log.info("Created loadable entity:", initialValue);

  return ({
    // Data.
    error: null,
    isLoading: false,
    value: initialValue,
    // todo: Object.assign
    // Methods.
    asInitial(): ILoadable<T, E> {
      return Object.assign(
        {},
        this,
        { error: null, isLoading: false, value: initialValue }
      );
    },
    asLoading(value?: T): ILoadable<T, E> {
      return Object.assign(
        {},
        this,
        { value: arguments.length ? value as T : this.value, error: null, isLoading: true }
      );
    },
    asFailed(error: E | null, value?: T): ILoadable<T, E> {
      return Object.assign(
        {},
        this,
        { error, isLoading: false, value: arguments.length > 1 ? value as T : this.value }
      );
    },
    asReady(value: T | null): ILoadable<T, E> {
      return Object.assign(
        {},
        this,
        { error: null, isLoading: false, value }
      );
    },
    asUpdated(value: T | null): ILoadable<T, E> {
      return Object.assign(
        {},
        this,
        { value }
      );
    }
  });
}

/**
 * Create mutable sub-state.
 */
export function createMutable<T extends object>(initialValue: T): TMutable<T> {
  log.info("Created mutable entity from:", initialValue);

  return Object.assign(
    {},
    initialValue,
    {
      [MUTABLE_KEY]: true,
      asMerged(state: Partial<T>): TMutable<T> {
        return Object.assign({}, this as TMutable<T>, state);
      }
    }
  );
}

/**
 * Bind decorator wrappers factory for methods binding.
 */
export function createBoundDescriptor <T>(from: TypedPropertyDescriptor<T>, property: PropertyKey) {
  log.info("Created bound descriptor for:", property);

  // Descriptor with lazy binding.
  return ({
    configurable: true,
    get(this: object): T {
      const bound: T = (from as any).value.bind(this);

      Object.defineProperty(this, property, {
        value: bound,
        configurable: true,
        writable: true
      });

      return bound;
    }
  });
}

/**
 * Setter method factory.
 * !Strictly typed generic method with 'update' lifecycle.
 */
export function createSetter<S extends object, D extends keyof S>(manager: ContextManager<S>, key: D) {
  log.info("Created context setter for:", manager.constructor.name, key);

  return (next: Partial<S[D]> | TPartialTransformer<S[D]>): void => {
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
    } as any);
  };
}

/**
 * Decorator factory.
 * Modifies method descriptor, so it will be bound to prototype instance once.
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 * Modified for proposal support.
 */
export function Bind(): MethodDecorator {
  return function<T>(
    targetOrDescriptor: object | MethodDescriptor,
    propertyKey: PropertyKey | undefined,
    descriptor: TypedPropertyDescriptor<T> | undefined
  ) {
    // Different behaviour for legacy and proposal decorators.
    if (propertyKey && descriptor) {
      return createBoundDescriptor(descriptor, propertyKey);
    } else {
      (targetOrDescriptor as MethodDescriptor).descriptor = createBoundDescriptor(
        (targetOrDescriptor as MethodDescriptor).descriptor,
        (targetOrDescriptor as MethodDescriptor).key
      );
    }
  };
}
