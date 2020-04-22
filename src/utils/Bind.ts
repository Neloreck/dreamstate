import { MethodDescriptor } from "../types";

import { log } from "../../build/macroses/log.macro";

/**
 * Bind decorator wrappers factory for methods binding.
 */
function createBoundDescriptor <T>(from: TypedPropertyDescriptor<T>, property: PropertyKey): PropertyDescriptor {
  log.info("Created bound descriptor for:", property);

  // Todo: Wait for autobind merge with fix of shared callbacks issue and other.
  let fn: T = from.value as T;
  let definingProperty: boolean = false;

  return ({
    configurable: true,
    get(this: object): T {
      if (
        definingProperty ||
        // this === target.prototype || - will it fire? Check parent prototypes?
        Object.prototype.hasOwnProperty.call(this, property) ||
        typeof fn !== "function"
      ) {
        return fn;
      }

      const bound: T = (from as any).value.bind(this);

      definingProperty = true;

      Object.defineProperty(this, property, {
        configurable: true,
        get() {
          return bound;
        },
        set(value) {
          fn = value;
          delete this[property];
        }
      });

      definingProperty = false;

      return bound;
    },
    set(value: any) {
      fn = value;
    }
  });
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
