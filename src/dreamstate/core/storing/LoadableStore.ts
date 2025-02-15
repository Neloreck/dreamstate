import { ILoadable } from "@/dreamstate/types";

/**
 * A utility class for extending nested stores with loadable state and enabling shallow checking.
 *
 * This class is used by the `ContextManager` to manage asynchronous data, track loading states,
 * and detect changes efficiently. It helps in handling data fetching scenarios where state
 * needs to reflect loading, success, or error conditions.
 */
export class LoadableStore<T, E extends Error = Error> implements ILoadable<T> {
  public value: T | null;
  public isLoading: boolean;
  public error: E | null;

  public constructor(value: T | null, isLoading: boolean, error: E | null) {
    this.value = value;
    this.isLoading = isLoading;
    this.error = error;
  }

  /**
   * Optionally sets a value for the loading state.
   * If provided, it updates the loading state with the given value.
   *
   * @template T - The type of the loading state value.
   * @template E - The type of error state, if any.
   * @param {T | undefined} value - The value to set for the loading state. If not provided, the loading
   *   state will remain unchanged.
   * @returns {ILoadable<T, E>} The updated loadable instance with the new loading state.
   */
  public asLoading(value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(arguments.length > 0 ? (value as T) : this.value, true, null);
  }

  /**
   * Optionally sets a value for the failed state.
   * If provided, it updates the state to reflect a failure and optionally includes the provided value.
   *
   * @template T - The type of the loading state value.
   * @template E - The type of the error state.
   * @param {E} error - The error object representing the failure state.
   * @param {T | undefined} value - Optional value to associate with the failed state. If not provided,
   *   the failure state will only reflect the error.
   * @returns {ILoadable<T, E>} The updated loadable instance with the failed state.
   */
  public asFailed(error: E, value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(arguments.length > 1 ? (value as T) : this.value, false, error);
  }

  /**
   * Optionally sets a value for the ready state.
   * If provided, it updates the state to reflect readiness and optionally includes the provided value.
   *
   * @template T - The type of the loading state value.
   * @template E - The type of the error state.
   * @param {T | undefined} value - Optional value to associate with the ready state. If not provided,
   *   the ready state will reflect only the readiness.
   * @returns {ILoadable<T, E>} The updated loadable instance with the ready state.
   */
  public asReady(value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(arguments.length > 0 ? (value as T) : this.value, false, null);
  }

  /**
   * Optionally sets the loading state and error for an update.
   * This method allows updating the loadable state with a new value, and optionally sets
   * the loading state and any associated error.
   *
   * @template T - The type of the loading state value.
   * @template E - The type of the error state.
   * @param {T} value - The new value to associate with the updated state.
   * @param {boolean} [isLoading=false] - Optional flag to set the loading state. Defaults to `false` if not provided.
   * @param {E | null} [error=null] - Optional error to associate with the update. Defaults to `null` if not provided.
   * @returns {ILoadable<T, E>} The updated loadable instance with the new value, loading state, and error.
   */
  public asUpdated(this: ILoadable<T, E>, value: T, isLoading?: boolean, error?: E | null): ILoadable<T, E> {
    return new LoadableStore<T, E>(
      value,
      arguments.length > 1 ? (isLoading as boolean) : this.isLoading,
      arguments.length > 2 ? (error as E) : this.error
    );
  }
}
