import { TCallable } from "@/dreamstate/types";

/**
 * Wait for all queued events.
 * Promisified setTimeout(,time || 0).
 */
export function nextAsyncQueue(ms?: number): Promise<void> {
  return new Promise((resolve: TCallable) => setTimeout(resolve, ms));
}
