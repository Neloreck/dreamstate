/**
 * Wait for all queued events.
 * Promisified setTimeout(,time || 0).
 */
export function nextAsyncQueue(ms?: number): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve, ms));
}
