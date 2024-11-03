export function sortByFavoriteAndTitle<T extends { isFavorite: boolean; title: string }>(
  list: T[]
): T[] {
  return [...list].sort((a, b) => {
    if (a.isFavorite === b.isFavorite) {
      return a.title.localeCompare(b.title);
    }

    return a.isFavorite ? -1 : 1;
  });
}
