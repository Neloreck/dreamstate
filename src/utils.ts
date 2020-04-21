import { ILoadable, MethodDescriptor, TMutable, TPartialTransformer } from "./types";
import { NESTED_STORE_KEY } from "./internals";
import { ContextManager } from "./management";

import { log } from "./macroses/log.macro";

/**
 * Util for loadable.
 */
export function asLoading<T, E>(this: ILoadable<T, E>, value?: T): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    { value: arguments.length ? value as T : this.value, error: null, isLoading: true }
  );
}

/**
 * Util for loadable.
 */
export function asFailed<T, E>(this: ILoadable<T, E>, error: E | null, value?: T): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    { error, isLoading: false, value: arguments.length > 1 ? value as T : this.value }
  );
}

/**
 * Util for loadable.
 */
export function asReady<T, E>(this: ILoadable<T, E>, value: T | null): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    { error: null, isLoading: false, value }
  );
}

/**
 * Util for loadable.
 */
export function asUpdated<T, E>(this: ILoadable<T, E>, value: T | null): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    { value }
  );
}

/**
 * Create loadable value utility.
 */
export function createLoadable<T, E>(initialValue: T | null = null): ILoadable<T, E> {
  log.info("Created loadable entity:", initialValue);

  return ({
    [NESTED_STORE_KEY]: true,
    // Data.
    error: null,
    isLoading: false,
    value: initialValue,
    // Methods.
    asLoading: asLoading,
    asFailed: asFailed,
    asReady: asReady,
    asUpdated: asUpdated
  });
}

export function asMerged<T extends object>(this: TMutable<T>, state: Partial<T>): T {
  return Object.assign({}, this as TMutable<T>, state);
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
      [NESTED_STORE_KEY]: true,
      asMerged: asMerged as any
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
