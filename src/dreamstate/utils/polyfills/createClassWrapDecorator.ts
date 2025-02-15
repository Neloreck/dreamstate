import { ClassDescriptor, TAnyValue } from "@/dreamstate/types";
import { isFunction } from "@/dreamstate/utils/typechecking";

// Todo: Wait for proper proposal decorators.
// Todo: Tests.
// Todo: Unused now.
export function createClassWrapDecorator<D>(resolver: (c: D) => D): ClassDecorator {
  return function <T>(classOrDescriptor: T) {
    // Legacy decorators and ES proposal.
    if (isFunction(classOrDescriptor)) {
      return resolver(classOrDescriptor as TAnyValue);
    } else {
      (classOrDescriptor as unknown as ClassDescriptor).finisher = function(wrappedComponent: T) {
        return resolver(wrappedComponent as TAnyValue);
      } as TAnyValue;

      return classOrDescriptor as TAnyValue;
    }
  };
}
