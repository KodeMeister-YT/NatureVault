import { describe, expect, it } from 'vitest';
import { coralReefVault } from './coralReef';

const TERRESTRIAL_KINDS = new Set(['tree', 'canopyTree', 'building', 'road', 'path', 'cactus']);

/**
 * Validates: Requirements 6.9, 3.5 (Property 4 instance — no terrestrial leakage underwater)
 *
 * The coral reef biome declares `water.kind: 'underwater-ambient'`, so it must
 * not ship any terrestrial-only object kind.
 */
describe('coralReefVault', () => {
  it('has no terrestrial objects', () => {
    const strayTerrestrialObjects = coralReefVault.objects.filter((o) => TERRESTRIAL_KINDS.has(o.kind));
    expect(strayTerrestrialObjects).toHaveLength(0);
  });
});
