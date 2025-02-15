/**
 * Shallow comparison typing for object checking method.
 * Defines a method for performing a shallow equality check between two objects.
 */
declare module "shallow-equal" {
  import { TAnyValue } from "@/dreamstate/types/general";

  export const shallowEqualObjects: (
    a: Record<string, TAnyValue> | null,
    b: Record<string, TAnyValue> | null
  ) => boolean;
}

/**
 * A global compiler flag indicating if the environment is development.
 * Code within 'if (IS_DEV)' will be removed in production bundles.
 */
declare let IS_DEV: boolean;
