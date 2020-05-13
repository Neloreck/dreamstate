import { MethodDescriptor } from "../types";

import { debug } from "../../cli/build/macroses/debug.macro";

/**
 * Bind decorator wrappers factory for methods binding.
 *
 * It is not obvious for javascript users that changing prototype descriptor of base class
 * will affect only one instance and all instances after its change.
 * This util is not intended to be used for all user-cases, only for library.
 * I would rather tell people to use another approach with instance binding than running into issues
 * with incorrect ES inheritance after runtime modification of base class.
 */
function createBoundDescriptor<T>(from: TypedPropertyDescriptor<T>, property: PropertyKey): PropertyDescriptor {
  debug.info("Created bound descriptor for:", property);

  // Todo: Wait for autobind merge with fix of shared callbacks issue and other.
  let definingProperty: boolean = false;

  return {
    configurable: true,
    get(this: object): T {
      if (
        definingProperty
        /*
          this === target.prototype || - will it fire? Check parent prototypes?
          Object.prototype.hasOwnProperty.call(this, property) ||
          typeof from.value !== "function"
         */
      ) {
        return from.value as any;
      }

      // Expect only functions to be called, throw errors on other cases.
      const bound: T = (from.value as any).bind(this);

      definingProperty = true;

      Object.defineProperty(this, property, {
        configurable: true,
        writable: false,
        value: bound
      });

      definingProperty = false;

      return bound;
    },
    set() {
      throw new Error("Direct runtime modification of decorated in a declarative way method is not allowed.");
    }
  };
}

/**
 * Decorator factory.
 * Modifies method descriptor, so it will be bound to prototype instance once.
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 * Modified for proposal support.
 */
export function Bind(): MethodDecorator {
  return function <T>(
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
