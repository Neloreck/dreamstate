import { TCallable } from "@/dreamstate/types";

/**
 * Waits for all queued events or a specified amount of time.
 * This function is essentially a promisified `setTimeout`.
 *
 * @param {number} [ms] - The time in milliseconds to wait. Defaults to 0 if not specified.
 * @returns {Promise<void>} A promise that resolves after the specified time has elapsed.
 */
export function nextAsyncQueue(ms: number = 0): Promise<void> {
  return new Promise((resolve: TCallable) => setTimeout(resolve, ms));
}
