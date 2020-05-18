import { NestedStore } from "@/dreamstate/core/observing/NestedStore";

// todo;

interface IAsync<T, E = Error> {
  get: Promise<T>;
  isLoading: boolean;
  error: E | null;
  asReady(value: T): void;
  asOpen(error: E): void;
  asFailed(error: E): void;
}

function asReady<T, E = Error>(
  this: IAsync<T, E>,
  value: T
): void {

}

function asFailed<T, E = Error>(
  this: IAsync<T, E>,
  error: T
): void {

}

function asOpen<T, E = Error>(
  this: IAsync<T, E>
): void {

}

/**
 * Util should manage async code like takeLatest and wrap real promise, so all subscribers will be able
 * to load latest valid data even if first promise was delayed/cancelled.
 */

/**
 * Create async values that always will be async and resolve with first opportunity.
 */
export function createAsync<T, E = Error>(
  value: T,
  error: E | null = null
): IAsync<T, E> {
  return Object.assign(
    new NestedStore(),
    {
      get: Promise.resolve(value),
      isLoading: false,
      error,
      asReady,
      asOpen,
      asFailed
    }
  );
}
