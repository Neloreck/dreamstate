export function nextAsyncQuery(): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve));
}

export function forMillis(milliseconds: number): Promise<void> {
  return new Promise((resolve: () => void) => setTimeout(resolve, milliseconds));
}
