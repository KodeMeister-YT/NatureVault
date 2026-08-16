import { describe, expect, it } from 'vitest';
import { vaults } from '../data/ecosystems/vaults';

/**
 * Validates: Requirements 7.1, 7.2
 *
 * Automated backstop for the Tier 4 biodiversity-hierarchy backfill pass: every
 * `EnvironmentalObject` across all 8 biomes that carries a non-null
 * `biodiversityCategory` must have at least `trophicRole` and `habitat`
 * populated (a non-empty string), regardless of which authoring task originally
 * created it. Objects with `biodiversityCategory: null` (pure scenery — rocks,
 * mountains, paths, roads, buildings, dry riverbeds, termite mounds) are
 * intentionally exempt.
 */
describe('biodiversity field coverage across all biomes', () => {
  for (const [ecosystemId, biome] of Object.entries(vaults)) {
    describe(ecosystemId, () => {
      for (const object of biome.objects) {
        if (object.biodiversityCategory === null) continue;

        it(`"${object.name}" (${object.id}) has trophicRole and habitat`, () => {
          expect(object.trophicRole, `${object.id} is missing trophicRole`).toBeDefined();
          expect(object.habitat, `${object.id} is missing habitat`).toBeDefined();
          expect(typeof object.habitat).toBe('string');
          expect((object.habitat ?? '').length).toBeGreaterThan(0);
        });
      }
    });
  }
});
