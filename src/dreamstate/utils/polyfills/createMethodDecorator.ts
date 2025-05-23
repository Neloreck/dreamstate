import { MethodDescriptor, TAnyObject, TAnyValue, TConstructor } from "@/dreamstate/types";

// Todo: Wait for proper proposal decorators.
// Todo: Tests.
export function createMethodDecorator<T extends TConstructor<TAnyValue>>(
  resolver: (method: string | symbol, constructor: T) => void
): MethodDecorator {
  return function(prototypeOrDescriptor: TAnyObject, method: string | symbol) {
    if (prototypeOrDescriptor && method) {
      resolver(method, prototypeOrDescriptor.constructor as T);

      return prototypeOrDescriptor;
    } else {
      (prototypeOrDescriptor as MethodDescriptor).finisher = function(targetClass: TAnyValue) {
        resolver((prototypeOrDescriptor as MethodDescriptor).key as string, targetClass as T);
      };

      return prototypeOrDescriptor;
    }
  };
}
