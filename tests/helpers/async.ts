export function nextAsyncQueue(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve));
}
