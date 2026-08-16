import type { BiomeDefinition } from '../types/vault';
import type { BiodiversityProfile, TrophicRole } from '../types/biome';
import type { BiodiversityCategory } from '../types/observation';
import { biodiversityCategories } from '../data/biodiversityCategories';

export const EDUCATIONAL_DATA_DISCLAIMER =
  'Illustrative educational simulation data, not a scientific species inventory.';

const TROPHIC_ROLES: TrophicRole[] = ['producer', 'primary-consumer', 'secondary-consumer', 'decomposer'];

function zeroCategoryMap(): Record<BiodiversityCategory, number> {
  const map = {} as Record<BiodiversityCategory, number>;
  for (const cat of biodiversityCategories) {
    map[cat.id] = 0;
  }
  return map;
}

function zeroTrophicRoleMap(): Record<TrophicRole, number> {
  const map = {} as Record<TrophicRole, number>;
  for (const role of TROPHIC_ROLES) {
    map[role] = 0;
  }
  return map;
}

export const BiodiversityProfileService = {
  /**
   * Derives species counts from the biome's own object list for a given year
   * (or all years if omitted), so the summary can never drift from the
   * underlying object list (design.md Property 5).
   */
  computeProfile(biome: BiomeDefinition, year?: number): BiodiversityProfile {
    const relevantObjects =
      year !== undefined ? biome.objects.filter((o) => o.presentInYears.includes(year)) : biome.objects;

    const byCategory = zeroCategoryMap();
    const byTrophicRole = zeroTrophicRoleMap();
    let totalSpecies = 0;

    for (const object of relevantObjects) {
      if (object.biodiversityCategory !== null) {
        byCategory[object.biodiversityCategory] += 1;
        totalSpecies += 1;
      }
      if (object.trophicRole) {
        byTrophicRole[object.trophicRole] += 1;
      }
    }

    return {
      totalSpecies,
      byCategory,
      byTrophicRole,
      disclaimer: EDUCATIONAL_DATA_DISCLAIMER,
    };
  },
};
