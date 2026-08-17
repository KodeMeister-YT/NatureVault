import { describe, expect, it } from 'vitest';
import { vaults } from './vaults';

/**
 * Validates: Requirement 8.2 — each of the 8 biomes must have a distinct
 * fog/lighting profile, confirmed here by asserting no two biomes share an
 * identical `(fog.color, sun.color, skyTreatment)` atmosphere tuple.
 *
 * This is a regression guard for the Task 28 manual audit, which found all 8
 * biomes' atmosphere tuples were already distinct — this test protects that
 * finding against future data-authoring regressions.
 */
describe('atmosphere distinctness across all 8 biomes (Requirement 8.2)', () => {
  const biomeEntries = Object.entries(vaults);

  it('covers exactly 8 biomes', () => {
    expect(biomeEntries).toHaveLength(8);
  });

  it('no two biomes share an identical (fog.color, sun.color, skyTreatment) tuple', () => {
    const tuples = biomeEntries.map(
      ([id, biome]) =>
        [id, `${biome.atmosphere.fog.color}|${biome.atmosphere.sun.color}|${biome.atmosphere.skyTreatment}`] as const,
    );

    const uniqueTuples = new Set(tuples.map(([, tuple]) => tuple));

    expect(
      uniqueTuples.size,
      `expected ${tuples.length} distinct atmosphere tuples but found ${uniqueTuples.size}: ${JSON.stringify(tuples)}`,
    ).toBe(biomeEntries.length);
  });

  it('no two biomes share the exact same fog.color AND sun.color simultaneously', () => {
    const pairs = biomeEntries.map(
      ([id, biome]) => [id, `${biome.atmosphere.fog.color}|${biome.atmosphere.sun.color}`] as const,
    );

    const uniquePairs = new Set(pairs.map(([, pair]) => pair));

    expect(
      uniquePairs.size,
      `expected ${pairs.length} distinct (fog.color, sun.color) pairs but found ${uniquePairs.size}: ${JSON.stringify(pairs)}`,
    ).toBe(biomeEntries.length);
  });
});
