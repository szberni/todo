export function trackById<T extends { id: number }>(index: number, item: T): number {
  return item.id;
}
