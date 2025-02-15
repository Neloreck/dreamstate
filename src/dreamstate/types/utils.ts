import { TAnyObject, TAnyValue } from "@/dreamstate/types/general";

/**
 * Represents a loadable store entry that manages transactional transitions for state updates.
 * Provides methods to represent the state of the entry as loading, ready, failed, or updated.
 */
export interface ILoadable<T, E = Error> {
  /**
   * The value associated with the loadable state, or null if no value is available.
   */
  readonly value: T | null;
  /**
   * A flag indicating whether the loadable state is in a loading state.
   */
  readonly isLoading: boolean;
  /**
   * The error associated with the loadable state, or null if no error occurred.
   */
  readonly error: E | null;

  /**
   * @param value Optional value to be associated with the ready state.
   * @returns a new loadable state as ready with an optional value.
   */
  asReady(value?: T): ILoadable<T, E>;

  /**
   * @param value The new value to be associated with the updated state.
   * @param isLoading Optional flag indicating whether the state is loading.
   * @param error Optional error associated with the updated state.
   * @returns a new loadable state as updated with a new value, and optionally an updated loading state and error.
   */
  asUpdated(value: T, isLoading?: boolean, error?: E | null): ILoadable<T, E>;

  /**
   * @param value Optional value to be associated with the loading state.
   * @returns a new loadable state as loading with an optional value.
   */
  asLoading(value?: T): ILoadable<T, E>;

  /**
   * @param error The error that caused the failure.
   * @param value Optional value associated with the failed state.
   * @returns a new loadable state as failed with an error and an optional value.
   */
  asFailed(error: E, value?: T): ILoadable<T, E>;
}

/**
 * Represents a base for a nested store that allows merging state.
 * Provides a method for merging state into the nested store.
 */
export interface INestedBase<T> {
  /**
   * Merges a partial state into the current nested state.
   *
   * @param state The partial state to be merged.
   * @returns The merged state.
   */
  asMerged(state: Partial<T>): TNested<T>;
}

/**
 * Represents a nested type that combines a base type with additional methods for merging state.
 */
export type TNested<T> = T & INestedBase<T>;

/**
 * Represents a computed field base with selectors and optional memoization and diff functionality.
 * Used for defining computed fields with custom selection logic and caching.
 */
export interface IComputedBase<T extends TAnyObject, C extends TAnyObject> {
  /**
   * A selector function that extracts the computed value from the context.
   *
   * @param context The context from which the value is computed.
   */
  readonly __selector__: (context: C) => T;

  /**
   * An optional memoization function to optimize the computed value calculation.
   *
   * @param context The context used to compute the memoized value.
   */
  readonly __memo__?: (context: C) => Array<TAnyValue>;

  /**
   * An optional diff array used to track differences in the computed value.
   */
  readonly __diff__?: Array<TAnyValue>;
}

/**
 * A computed type that combines the base computed functionality with the specific type of the computed value.
 */
export type TComputed<T extends TAnyObject, C extends TAnyObject = TAnyValue> = T & IComputedBase<T, C>;
