export function sortById<T extends { id: number }>(items: T[], order: number[]): T[] {
  const filteredItems = items.filter(({ id }) => order.includes(id));

  return [...filteredItems].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
}
