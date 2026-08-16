import { describe, expect, it } from 'vitest';
import { freshwaterLakeVault } from './freshwaterLake';

/**
 * Validates: Requirements 6.7
 *
 * The largest explicit `featureRadius` used by any existing pond/creek/river
 * object elsewhere in the codebase today is 9 (evergreenValley's `creek-main`).
 * The freshwater lake's `lake`-kind object must clearly exceed that to read as
 * a genuinely larger body of water, distinct from every other biome's water
 * feature.
 */
describe('freshwaterLakeVault', () => {
  it('has a lake object with featureRadius greater than the largest existing pond/creek/river radius', () => {
    const lakeObject = freshwaterLakeVault.objects.find((o) => o.kind === 'lake');
    expect(lakeObject).toBeDefined();
    expect(lakeObject?.featureRadius).toBeGreaterThan(9);
  });
});
