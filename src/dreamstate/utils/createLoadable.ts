import { LoadableStore } from "@/dreamstate/core/storing/LoadableStore";
import { ILoadable } from "@/dreamstate/types";

/**
 * Create loadable value utility.
 * Useful when your context value has error/loading states.
 *
 * Note: dreamstate applies deeper shallow checking for loadable values, same as for 'createNested'.
 */
export function createLoadable<T, E extends Error = Error>(
  value: T | null = null,
  isLoading: boolean = false,
  error: E | null = null
): ILoadable<T, E> {
  return new LoadableStore(value, isLoading, error);
}
