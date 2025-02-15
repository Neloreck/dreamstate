/**
 * Shallow comparison typing for object checking method.
 * Defines a method for performing a shallow equality check between two objects.
 */
declare module "shallow-equal" {
  export const shallowEqualObjects: (a: Record<string, any> | null, b: Record<string, any> | null) => boolean;
}

/**
 * A global compiler flag indicating if the environment is development.
 * Code within 'if (IS_DEV)' will be removed in production bundles.
 */
declare const IS_DEV: boolean;
