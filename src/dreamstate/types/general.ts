/**
 * A generic constructor type.
 * Defines a constructor signature for creating instances of a specified type.
 */
export type TConstructor<T> = {
  new (...args: unknown[]): T;
};

/**
 * A callable function type with no parameters.
 * Represents any function that does not take any arguments and returns nothing.
 */
export type TCallable = () => void;

/**
 * A callable function type that can accept any number of parameters and return any type of value.
 */
export type TAnyCallable = (...args: Array<any>) => any;

/**
 * An object type that can contain any properties with any values.
 */
export type TAnyObject = Record<string, any>;

/**
 * An object type that cannot be accessed because data is unknown.
 */
export type TEmptyObject = Record<string, unknown>;

/**
 * Represents an uninitialized value.
 */
export type TUninitializedValue = any;

/**
 * Represents any value.
 */
export type TAnyValue = any;
