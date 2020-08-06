declare module "shallow-equal" {
  export const shallowEqualObjects: (a: object | null, b: object | null) => boolean;
}

declare const IS_DEV: boolean;
