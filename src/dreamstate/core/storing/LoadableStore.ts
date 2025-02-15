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
   * Optionally set value for loading state.
   */
  public asLoading(value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(arguments.length > 0 ? (value as T) : this.value, true, null);
  }

  /**
   * Optionally set value for failed state.
   */
  public asFailed(error: E, value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(arguments.length > 1 ? (value as T) : this.value, false, error);
  }

  /**
   * Optionally set value for ready state.
   */
  public asReady(value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(arguments.length > 0 ? (value as T) : this.value, false, null);
  }

  /**
   * Optionally set loading state and error for update.
   */
  public asUpdated(this: ILoadable<T, E>, value: T, isLoading?: boolean, error?: E | null): ILoadable<T, E> {
    return new LoadableStore<T, E>(
      value,
      arguments.length > 1 ? (isLoading as boolean) : this.isLoading,
      arguments.length > 2 ? (error as E) : this.error
    );
  }
}
