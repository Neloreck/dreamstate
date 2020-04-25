import { ILoadable } from "../types";
import { NESTED_STORE_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Util for loadable.
 */
export function asLoading<T, E>(this: ILoadable<T, E>, value?: T): ILoadable<T, E> {
  return Object.assign({}, this, {
    value: arguments.length ? (value as T) : this.value,
    error: null,
    isLoading: true
  });
}

/**
 * Util for loadable.
 */
export function asFailed<T, E>(this: ILoadable<T, E>, error: E | null, value?: T): ILoadable<T, E> {
  return Object.assign({}, this, {
    error,
    isLoading: false,
    value: arguments.length > 1 ? (value as T) : this.value
  });
}

/**
 * Util for loadable.
 */
export function asReady<T, E>(this: ILoadable<T, E>, value: T | null): ILoadable<T, E> {
  return Object.assign({}, this, { error: null, isLoading: false, value });
}

/**
 * Util for loadable.
 */
export function asUpdated<T, E>(this: ILoadable<T, E>, value: T | null): ILoadable<T, E> {
  return Object.assign({}, this, { value });
}

/**
 * Create loadable value utility.
 */
export function createLoadable<T, E>(
  value: T | null = null,
  isLoading: boolean = false,
  error: E | null = null
): ILoadable<T, E> {
  log.info("Created loadable entity:", value);

  return {
    [NESTED_STORE_KEY]: true,
    error,
    isLoading,
    value,
    asLoading: asLoading,
    asFailed: asFailed,
    asReady: asReady,
    asUpdated: asUpdated
  };
}
