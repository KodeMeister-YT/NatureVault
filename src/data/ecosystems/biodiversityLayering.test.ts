import { describe, expect, it } from 'vitest';
import { vaults } from './vaults';
import type { ObjectKind } from '../../types/vault';

/**
 * Five-layer ecological classification used during Task 15's manual
 * verification pass. A `kind` may appear in more than one layer set (e.g.
 * `dryRiverbed` is both a landscape feature and an environmental trace) —
 * the intent of this test is "does this layer have visible representation
 * in the biome", not "is every object uniquely assigned to exactly one
 * layer", so overlap across sets is expected and fine.
 */
const LAYER_KINDS: Record<string, Set<ObjectKind>> = {
  'Layer 1 (Landscape)': new Set<ObjectKind>([
    'river',
    'pond',
    'creek',
    'lake',
    'waterfall',
    'dryRiverbed',
    'mountain',
    'rock',
  ]),
  'Layer 2 (Vegetation)': new Set<ObjectKind>([
    'tree',
    'canopyTree',
    'plant',
    'reed',
    'fern',
    'moss',
    'vine',
    'tropicalFlower',
    'cactus',
  ]),
  'Layer 3 (Small life)': new Set<ObjectKind>(['frog', 'pollinator', 'crab', 'anemone']),
  'Layer 4 (Larger wildlife)': new Set<ObjectKind>(['bird', 'animal', 'turtle', 'fishSchool']),
  'Layer 5 (Environmental traces)': new Set<ObjectKind>(['log', 'fungi', 'termiteMound', 'dryRiverbed']),
};

/**
 * Validates: Requirements 3.1, 3.2 — every biome's current-year object list
 * must contain at least 8 interactive objects and include at least one
 * object from each of the 5 ecological layers.
 */
describe('biodiversity density and layering across all biomes (Requirements 3.1, 3.2)', () => {
  for (const [ecosystemId, biome] of Object.entries(vaults)) {
    describe(ecosystemId, () => {
      const currentYear = biome.years[biome.years.length - 1].year;
      const currentYearObjects = biome.objects.filter((object) =>
        object.presentInYears.includes(currentYear),
      );

      it(`has at least 8 current-year (${currentYear}) objects`, () => {
        expect(currentYearObjects.length).toBeGreaterThanOrEqual(8);
      });

      for (const [layerName, kinds] of Object.entries(LAYER_KINDS)) {
        it(`includes at least one ${layerName} object in the current year`, () => {
          const hasLayerRepresentation = currentYearObjects.some((object) => kinds.has(object.kind));
          expect(hasLayerRepresentation).toBe(true);
        });
      }
    });
  }
});
