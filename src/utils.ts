import { ILoadable, MethodDescriptor, TMutable } from "./types";
import { MUTABLE_KEY } from "./internals";

/**
 * Create loadable value utility.
 */
export function createLoadable<T, E>(initialValue: T | null = null): ILoadable<T, E> {
  return ({
    // Data.
    error: null,
    isLoading: false,
    value: initialValue,
    // Methods.
    asInitial(): ILoadable<T, E> {
      return { ...this, error: null, isLoading: false, value: initialValue };
    },
    asLoading(value?: T): ILoadable<T, E> {
      return { ...this, value: arguments.length ? value as T : this.value, error: null, isLoading: true };
    },
    asFailed(error: E | null, value?: T): ILoadable<T, E> {
      return { ...this, error, isLoading: false, value: arguments.length > 1 ? value as T : this.value, };
    },
    asReady(value: T | null): ILoadable<T, E> {
      return { ...this, error: null, isLoading: false, value };
    },
    asUpdated(value: T | null): ILoadable<T, E> {
      return { ...this, value };
    }
  });
}

/**
 * Create mutable sub-state.
 */
export function createMutable<T extends object>(initialValue: T): TMutable<T> {
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
 * Decorator factory.
 * Modifies method descriptor, so it will be bound to prototype instance once.
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 */
export function Bind(): MethodDecorator {
  // Higher order decorator to reserve closure parameters for future.
  return function<T>(
    targetOrDescriptor: object | MethodDescriptor,
    propertyKey: PropertyKey | undefined,
    descriptor: TypedPropertyDescriptor<T> | undefined
  ) {
    // Different behaviour for legacy and proposal decorators.
    if (propertyKey && descriptor) {
      // If it is legacy method decorator.
      if (typeof descriptor.value !== "function") {
        throw new TypeError(`Only methods can be decorated with @Bind. ${propertyKey.toString()} is not a method.`);
      } else {
        return createBoundDescriptor(descriptor, propertyKey);
      }
    } else {
      // If it is not proposal method decorator.
      if ((targetOrDescriptor as MethodDescriptor).kind !== "method") {
        throw new TypeError(
          "Only methods can be decorated with @Bind. Not a method supplied:" +
          (targetOrDescriptor as MethodDescriptor).key.toString()
        );
      } else {
        (targetOrDescriptor as MethodDescriptor).descriptor = createBoundDescriptor(
          (targetOrDescriptor as MethodDescriptor).descriptor,
          (targetOrDescriptor as MethodDescriptor).key
        );

        return targetOrDescriptor;
      }
    }
  };
}
