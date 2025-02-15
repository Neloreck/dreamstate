import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { EDreamstateErrorCode, MethodDescriptor, TAnyObject } from "@/dreamstate/types";

/**
 * Bind decorator wrappers factory for methods binding.
 */
function createBoundDescriptor<T>(from: TypedPropertyDescriptor<T>, property: PropertyKey): PropertyDescriptor {
  // Todo: Wait for autobind merge with fix of shared callbacks issue and other.
  let definingProperty: boolean = false;

  return {
    configurable: true,
    get(this: TAnyObject): T {
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
        value: bound,
      });

      definingProperty = false;

      return bound;
    },
    set() {
      throw new DreamstateError(
        EDreamstateErrorCode.RESTRICTED_OPERATION,
        "Direct runtime modification of bound method is not allowed."
      );
    },
  };
}

/**
 * Decorator factory.
 * Modifies method descriptor, so it will be bound to prototype instance.
 *
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 * Modified for proposal support.
 *
 * @returns class method decorator.
 */
export function Bind(): MethodDecorator {
  return function <T>(
    targetOrDescriptor: TAnyObject | MethodDescriptor,
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
