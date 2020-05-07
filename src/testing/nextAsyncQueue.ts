/**
 * Wait for all queued events.
 * Promisified setTimeout(,0).
 */
export function nextAsyncQueue(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve));
}
