import { describe, expect, it } from 'vitest';
import { vaults } from './vaults';
import type { EnvironmentalObject } from '../../types/vault';

const NEW_OBJECT_KINDS = new Set(['crab', 'turtle', 'anemone']);

/**
 * Validates: Requirement 3.4 — every newly introduced object (crab/turtle/anemone)
 * with a non-null `biodiversityCategory` must have `trophicRole`, `habitat`, and at
 * least one of `diet`/`environmentalPressures` populated, consistent with the existing
 * biodiversity-hierarchy backfill standard.
 *
 * This is authored as a standard iteration test (not a generated-input property) per
 * the task description, since the set of crab/turtle/anemone objects across the 8
 * biomes is small and fixed rather than something worth fuzzing.
 */
describe('Biodiversity field coverage for new object kinds (crab/turtle/anemone) — Property 8', () => {
  const newKindObjects: EnvironmentalObject[] = Object.values(vaults).flatMap((biome) =>
    biome.objects.filter((object) => NEW_OBJECT_KINDS.has(object.kind)),
  );

  it('finds at least 3 crab/turtle/anemone objects across all biomes (non-vacuous check)', () => {
    expect(newKindObjects.length).toBeGreaterThanOrEqual(3);
  });

  it.each(newKindObjects.map((object) => [object.id, object] as const))(
    '%s has trophicRole, habitat, and at least one of diet/environmentalPressures when biodiversityCategory is non-null',
    (_id, object) => {
      if (object.biodiversityCategory === null) {
        return;
      }

      expect(object.trophicRole, `${object.id} is missing trophicRole`).toBeDefined();
      expect(object.habitat, `${object.id} is missing habitat`).toBeDefined();

      const hasDiet = typeof object.diet === 'string' && object.diet.length > 0;
      const hasPressures = Array.isArray(object.environmentalPressures) && object.environmentalPressures.length > 0;
      expect(
        hasDiet || hasPressures,
        `${object.id} must have a non-empty diet string or a non-empty environmentalPressures array`,
      ).toBe(true);
    },
  );
});
