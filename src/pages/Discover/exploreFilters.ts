import type { Ecosystem, EcosystemType } from '../../types/ecosystem';

export type ExploreFilterCategory =
  | 'Forest'
  | 'Wetland'
  | 'Desert'
  | 'Mountain'
  | 'Freshwater'
  | 'Grassland'
  | 'Marine'
  | 'Tropical';

export const filterCategoryToEcosystemTypes: Record<ExploreFilterCategory, EcosystemType[]> = {
  Forest: ['temperate-forest'],
  Wetland: ['wetland'],
  Desert: ['desert'],
  Mountain: ['alpine'],
  Freshwater: ['lake'],
  Grassland: ['savanna'],
  Marine: ['coral-reef'],
  Tropical: ['tropical-forest'],
};

/**
 * Filters ecosystems by a case-insensitive search query (matched against name,
 * location, and description) and, if any filters are active, by whether the
 * ecosystem's type is in the union of EcosystemTypes mapped to the active filters.
 *
 * Validates: Requirements 6.1, 6.2
 */
export function filterEcosystems(
  ecosystems: Ecosystem[],
  searchQuery: string,
  activeFilters: Set<ExploreFilterCategory>,
): Ecosystem[] {
  const normalizedQuery = searchQuery.trim().toLowerCase();
  const allowedTypes =
    activeFilters.size === 0
      ? null
      : new Set(Array.from(activeFilters).flatMap((f) => filterCategoryToEcosystemTypes[f]));

  return ecosystems.filter((e) => {
    const matchesQuery =
      normalizedQuery === '' ||
      e.name.toLowerCase().includes(normalizedQuery) ||
      e.location.toLowerCase().includes(normalizedQuery) ||
      e.description.toLowerCase().includes(normalizedQuery);
    const matchesFilter = allowedTypes === null || allowedTypes.has(e.type);
    return matchesQuery && matchesFilter;
  });
}
