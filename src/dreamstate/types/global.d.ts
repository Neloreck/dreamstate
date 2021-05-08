/**
 * Shallow comparison typing for object checking method.
 */
declare module "shallow-equal" {
  export const shallowEqualObjects: (a: Record<string, any> | null, b: Record<string, any> | null) => boolean;
}

/**
 * Global compiler flag that indicates dev environment.
 * Everything behind 'if (IS_DEV)' will be removed for production bundles.
 */
declare const IS_DEV: boolean;
