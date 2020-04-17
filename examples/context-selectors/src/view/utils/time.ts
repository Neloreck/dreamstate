export function getFullCurrentTime(): string {
  const date: Date = new Date();
  return `${date.toLocaleTimeString("en-GB")}:${date.getMilliseconds()}`;
}