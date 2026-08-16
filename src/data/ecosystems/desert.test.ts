import { describe, expect, it } from 'vitest';
import { desertVault } from './desert';

const WATER_KINDS = new Set(['river', 'pond', 'creek', 'lake', 'waterfall']);

/**
 * Validates: Requirements 6.6, 3.4 (Property 3 instance — water/terrain consistency)
 *
 * The desert biome declares `water.kind: 'none'`, so it must not ship any
 * discrete water-kind object.
 */
describe('desertVault', () => {
  it('has no water-kind objects', () => {
    const strayWaterObjects = desertVault.objects.filter((o) => WATER_KINDS.has(o.kind));
    expect(strayWaterObjects).toHaveLength(0);
  });
});
