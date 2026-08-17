import { describe, expect, it } from 'vitest';
import { applyScenario, resolveMetricsForYear } from './ScenarioService';
import { vaults } from '../data/ecosystems/vaults';
import { continueAsIs, protectAndRestore } from '../data/scenarios';

/**
 * Regression guard for Requirement 5.2: a biome's FIRST projected year must
 * always resolve to a scale factor of exactly 1, matching the pre-Task-18
 * behavior (`applyScenario(previous, scenario)` with no scaling) exactly.
 *
 * Task 16 gave every real biome a second projected year (2075) in addition
 * to 2050, so there are no real biomes left with exactly one projected
 * year — but the enduring invariant this sub-task protects is that each
 * biome's FIRST future fork point always applies the scenario modifier at
 * scale 1, identical to how a hypothetical single-projected-year biome
 * would behave. This test verifies that invariant against the real,
 * fully-authored biome data rather than a synthetic years array.
 *
 * Validates: Requirements 5.2
 */
describe('resolveMetricsForYear — first projected year is unaffected by multi-year scaling (Requirement 5.2)', () => {
  const PROJECTED_YEAR_THRESHOLD = 2050;

  const biomeEntries = Object.entries(vaults);

  it.each(biomeEntries)(
    '%s: first projected year resolves identically to applyScenario(present, scenario, 1) under Continue as Is',
    (_ecosystemId, biome) => {
      const years = biome.years;
      const projectedYears = years.map((y) => y.year).filter((y) => y >= PROJECTED_YEAR_THRESHOLD);
      expect(projectedYears.length).toBeGreaterThan(0);

      const firstProjectedYear = Math.min(...projectedYears);
      const presentYear = Math.max(...years.map((y) => y.year).filter((y) => y < firstProjectedYear));
      const presentYearMetrics = years.find((y) => y.year === presentYear)!.metrics;

      const actual = resolveMetricsForYear(years, firstProjectedYear, continueAsIs.id);
      const expected = applyScenario(presentYearMetrics, continueAsIs, 1);

      expect(actual).toEqual(expected);
    },
  );

  it.each(biomeEntries)(
    '%s: first projected year resolves identically to applyScenario(present, scenario, 1) under Protect & Restore',
    (_ecosystemId, biome) => {
      const years = biome.years;
      const projectedYears = years.map((y) => y.year).filter((y) => y >= PROJECTED_YEAR_THRESHOLD);
      expect(projectedYears.length).toBeGreaterThan(0);

      const firstProjectedYear = Math.min(...projectedYears);
      const presentYear = Math.max(...years.map((y) => y.year).filter((y) => y < firstProjectedYear));
      const presentYearMetrics = years.find((y) => y.year === presentYear)!.metrics;

      const actual = resolveMetricsForYear(years, firstProjectedYear, protectAndRestore.id);
      const expected = applyScenario(presentYearMetrics, protectAndRestore, 1);

      expect(actual).toEqual(expected);
    },
  );
});
