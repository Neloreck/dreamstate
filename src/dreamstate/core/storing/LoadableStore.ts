import { ILoadable, TAnyObject } from "@/dreamstate/types";

/**
 * Class for nested stores extension and proper shallow checking.
 * Used by context diff checker on updates by ContextManager class.
 */
export class LoadableStore<T extends TAnyObject, E extends Error = Error> implements ILoadable<T> {

  public value: T | null;
  public isLoading: boolean;
  public error: E | null;

  public constructor(
    value: T | null,
    isLoading: boolean,
    error: E | null
  ) {
    this.value = value;
    this.isLoading = isLoading;
    this.error = error;
  }

  /**
   * Util for loadable.
   * Optionally set value for loading state.
   */
  public asLoading(value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(
      arguments.length > 0 ? (value as T) : this.value,
      true,
      null
    );
  }

  /**
   * Util for loadable.
   * Optionally set value for failed state.
   */
  public asFailed(error: E, value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(
      arguments.length > 1 ? (value as T) : this.value,
      false,
      error
    );
  }

  /**
   * Util for loadable.
   * Optionally set value for ready state.
   */
  public asReady(value?: T): ILoadable<T, E> {
    return new LoadableStore<T, E>(
      arguments.length > 0 ? value as T : this.value,
      false,
      null
    );
  }

  /**
   * Util for loadable.
   * Optionally set loading state and error for update.
   */
  public asUpdated(
    this: ILoadable<T, E>,
    value: T,
    isLoading?: boolean,
    error?: E | null
  ): ILoadable<T, E> {
    return new LoadableStore<T, E>(
      value,
      arguments.length > 1 ? isLoading as boolean: this.isLoading,
      arguments.length > 2 ? error as E : this.error
    );
  }

}
