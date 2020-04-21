import { ClassDescriptor, MethodDescriptor, TConstructor } from "../types";

export function createMethodDecorator<T extends TConstructor<any>>(
  resolver: (method: string | symbol, constructor: T) => void,
): MethodDecorator {
  return function (prototypeOrDescriptor: object, method: string | symbol) {
    if (prototypeOrDescriptor && method) {
      resolver(method, prototypeOrDescriptor.constructor as T);
      return prototypeOrDescriptor;
    } else {
      (prototypeOrDescriptor as MethodDescriptor).finisher = function (targetClass: any) {
        resolver((prototypeOrDescriptor as MethodDescriptor).key as string, targetClass as T);
      };
      return prototypeOrDescriptor;
    }
  };
}

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
