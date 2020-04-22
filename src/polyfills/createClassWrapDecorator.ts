import { ClassDescriptor } from "../types";

// Todo: Wait for proper proposal decorators.

export function createClassWrapDecorator<D>(resolver: (c: D) => D): ClassDecorator {
  return function<T>(classOrDescriptor: T) {
    // Legacy decorators and ES proposal.
    if (typeof classOrDescriptor === "function") {
      return resolver(classOrDescriptor as any);
    } else {
      (classOrDescriptor as any as ClassDescriptor).finisher = function (wrappedComponent: T) {
        return resolver(wrappedComponent as any);
      } as any;
      return classOrDescriptor as any;
    }
  };
}
