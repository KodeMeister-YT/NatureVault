import { describe, expect, it } from 'vitest';
import { vaults } from '../../../data/ecosystems/vaults';

const WATER_KINDS = new Set(['river', 'pond', 'creek', 'lake', 'waterfall']);

/**
 * Validates: Requirements 3.4 (Property 3 in design.md — water/terrain consistency)
 *
 * If a biome declares `water.kind === 'none'`, none of its objects may be a
 * water-kind object. This is a dev-time/data-authoring guard, run as a unit
 * test against every biome in the vaults map so a future biome can't silently
 * ship a stray pond object when it claims to have no water at all.
 */
describe('water-kind/biome-config consistency (P3)', () => {
  it('every biome with water.kind === "none" has no water-kind objects', () => {
    for (const [id, biome] of Object.entries(vaults)) {
      if (biome.water.kind === 'none') {
        const strayWaterObjects = biome.objects.filter((o) => WATER_KINDS.has(o.kind));
        expect(strayWaterObjects, `biome "${id}" declares water.kind: 'none' but has water-kind objects`).toHaveLength(0);
      }
    }
  });

  it('every biome with water.kind === "underwater-ambient" has no terrestrial-only objects rendered via WaterFeatureRenderer', () => {
    // WaterFeatureRenderer is never used for underwater-ambient biomes (Requirement 3.5) —
    // enforced structurally since WaterFeatureRenderer only dispatches on water-kind
    // ObjectKind values, none of which a reef-style biome should author.
    for (const [id, biome] of Object.entries(vaults)) {
      if (biome.water.kind === 'underwater-ambient') {
        const strayWaterObjects = biome.objects.filter((o) => WATER_KINDS.has(o.kind));
        expect(
          strayWaterObjects,
          `biome "${id}" declares water.kind: 'underwater-ambient' but has discrete water-kind objects`,
        ).toHaveLength(0);
      }
    }
  });
});
