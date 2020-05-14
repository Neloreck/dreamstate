import { MethodDescriptor, TConstructor } from "@Lib/core/types";

// Todo: Wait for proper proposal decorators.
// Todo: Tests.

export function createMethodDecorator<T extends TConstructor<any>>(
  resolver: (method: string | symbol, constructor: T) => void
): MethodDecorator {
  return function(prototypeOrDescriptor: object, method: string | symbol) {
    if (prototypeOrDescriptor && method) {
      resolver(method, prototypeOrDescriptor.constructor as T);

      return prototypeOrDescriptor;
    } else {
      (prototypeOrDescriptor as MethodDescriptor).finisher = function(targetClass: any) {
        resolver((prototypeOrDescriptor as MethodDescriptor).key as string, targetClass as T);
      };

      return prototypeOrDescriptor;
    }
  };
}
