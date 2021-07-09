/**
 * Generic constructor.
 */
export type TConstructor<T> = {
  new (...args: unknown[]): T;
};

/**
 * Any callable function without parameters.
 */
export type TCallable = () => void;

/**
 * Any callable function that can contain any params and return values.
 */
export type TAnyCallable = (...args: Array<any>) => any;

/**
 * Any object that can contain anything.
 */
export type TAnyObject = Record<string, any>;

/**
 * Any object that cannot be accessed because data is unknown.
 */
export type TEmptyObject = Record<string, unknown>;

export type TUninitializedValue = any;
