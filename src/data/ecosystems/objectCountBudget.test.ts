import { describe, expect, it } from 'vitest';
import { vaults } from './vaults';

const MIN_OBJECT_COUNT = 20;
const MAX_OBJECT_COUNT = 60;

/**
 * Validates: Requirement 9.4 — every biome's total object count must stay within
 * a [20, 60] budget so per-biome instance counts remain performant across devices.
 */
describe('per-biome object-count budget (Requirement 9.4)', () => {
  const biomeEntries = Object.entries(vaults);

  it('has at least one biome to check (non-vacuous check)', () => {
    expect(biomeEntries.length).toBeGreaterThan(0);
  });

  it.each(biomeEntries)('%s has objects.length within [20, 60]', (ecosystemId, biome) => {
    const count = biome.objects.length;
    expect(
      count >= MIN_OBJECT_COUNT && count <= MAX_OBJECT_COUNT,
      `${ecosystemId} ("${biome.name}") has ${count} objects, expected between ${MIN_OBJECT_COUNT} and ${MAX_OBJECT_COUNT}`,
    ).toBe(true);
  });
});
