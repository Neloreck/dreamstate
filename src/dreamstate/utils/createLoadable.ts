import { LoadableStore } from "@/dreamstate/core/storing/LoadableStore";
import { ILoadable } from "@/dreamstate/types";

/**
 * Creates a loadable value, which is useful when the context value has error/loading states.
 * The loadable value can represent different states: loading, ready, or error.
 *
 * @template T The type of the value being loaded.
 * @template E The type of the error (defaults to `Error`).
 * @param {T | null} [value] The initial value or `null` if not yet loaded.
 * @param {boolean} [isLoading] A flag indicating whether the value is in a loading state.
 * @param {E | null} [error] The error if the value failed to load, or `null` if no error.
 * @returns {ILoadable<T, E>} A loadable value utility representing the current state of the value.
 */
export function createLoadable<T, E extends Error = Error>(
  value: T | null = null,
  isLoading: boolean = false,
  error: E | null = null
): ILoadable<T, E> {
  return new LoadableStore(value, isLoading, error);
}
