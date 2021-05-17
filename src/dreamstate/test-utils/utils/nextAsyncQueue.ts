import { TCallable } from "@/dreamstate/types";

/**
 * Wait for all queued events or wait for specified time.
 * Promisified setTimeout(,time || 0).
 *
 * @param {number=0} ms - time in milliseconds that should be awaited, defaults to 0.
 * @returns {Promise} resolving promise after selected amount of time.
 */
export function nextAsyncQueue(ms: number = 0): Promise<void> {
  return new Promise((resolve: TCallable) => setTimeout(resolve, ms));
}
