declare module "shallow-equal" {
  export const shallowEqualObjects: (a: Record<string, any> | null, b: Record<string, any> | null) => boolean;
}

declare const IS_DEV: boolean;
