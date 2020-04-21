import { ILoadable } from "../types";
import { NESTED_STORE_KEY } from "../internals";

import { log } from "../../build/macroses/log.macro";

/**
 * Util for loadable.
 */
function asLoading<T, E>(this: ILoadable<T, E>, value?: T): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    { value: arguments.length ? value as T : this.value, error: null, isLoading: true }
  );
}

/**
 * Util for loadable.
 */
function asFailed<T, E>(this: ILoadable<T, E>, error: E | null, value?: T): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    { error, isLoading: false, value: arguments.length > 1 ? value as T : this.value }
  );
}

/**
 * Util for loadable.
 */
function asReady<T, E>(this: ILoadable<T, E>, value: T | null): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    { error: null, isLoading: false, value }
  );
}

/**
 * Util for loadable.
 */
function asUpdated<T, E>(this: ILoadable<T, E>, value: T | null): ILoadable<T, E> {
  return Object.assign(
    {},
    this,
    { value }
  );
}

/**
 * Create loadable value utility.
 */
export function createLoadable<T, E>(initialValue: T | null = null): ILoadable<T, E> {
  log.info("Created loadable entity:", initialValue);

  return ({
    [NESTED_STORE_KEY]: true,
    // Data.
    error: null,
    isLoading: false,
    value: initialValue,
    // Methods.
    asLoading: asLoading,
    asFailed: asFailed,
    asReady: asReady,
    asUpdated: asUpdated
  });
}
