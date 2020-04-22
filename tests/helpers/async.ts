export function nextAsyncQuery(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve));
}
