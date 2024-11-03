export function getIds<T extends { id: number }>(list: T[]): number[] {
  return list.map(({ id }) => id);
}
