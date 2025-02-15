import { DreamstateError } from "@/dreamstate/core/error/DreamstateError";
import { EDreamstateErrorCode, MethodDescriptor, TAnyObject } from "@/dreamstate/types";

/**
 * Factory function that creates a bound method descriptor for a given method.
 * This ensures the method is bound to the instance, preserving the correct `this` context when invoked.
 *
 * @template T The type of the method being bound.
 * @param {TypedPropertyDescriptor<T>} from The original typed property descriptor of the method to bind.
 * @param {PropertyKey} property The property key of the method being modified.
 * @returns {PropertyDescriptor} A new property descriptor with the method bound to the instance.
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
 * Decorator factory that modifies the method descriptor to bind the method to the prototype instance.
 * This ensures that the method retains the correct `this` context when invoked.
 *
 * All credits: 'https://www.npmjs.com/package/autobind-decorator'.
 * Modified to support proposal syntax.
 *
 * @returns {MethodDecorator} A method decorator that binds the method to the instance prototype.
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
