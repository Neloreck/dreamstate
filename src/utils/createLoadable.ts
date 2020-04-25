import { ILoadable } from "../types";
import { NESTED_STORE_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Util for loadable.
 * Optionally set value for loading state.
 */
export function asLoading<T, E>(this: ILoadable<T, E>, value?: T): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    {
      value: arguments.length > 0 ? (value as T) : this.value,
      error: null,
      isLoading: true
    }
  );
}

/**
 * Util for loadable.
 * Optionally set value for failed state.
 */
export function asFailed<T, E>(this: ILoadable<T, E>, error: E | null, value?: T): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    {
      error,
      isLoading: false,
      value: arguments.length > 1 ? (value as T) : this.value
    }
  );
}

/**
 * Util for loadable.
 * Optionally set value for ready state.
 */
export function asReady<T, E>(this: ILoadable<T, E>, value?: T): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    {
      error: null,
      isLoading: false,
      value: arguments.length > 0 ? value : this.value
    }
  );
}

/**
 * Util for loadable.
 * Optionally set loading state and error for update.
 */
export function asUpdated<T, E>(
  this: ILoadable<T, E>,
  value: T,
  isLoading?: boolean,
  error?: E | null
): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    {
      value,
      isLoading: arguments.length > 1 ? isLoading : this.isLoading,
      error: arguments.length > 2 ? error : this.error
    }
  );
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
