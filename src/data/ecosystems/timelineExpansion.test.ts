import { describe, expect, it } from 'vitest';
import { vaults } from './vaults';
import type { VaultYearState } from '../../types/vault';

const PROJECTED_YEAR_THRESHOLD = 2050;

/**
 * Determines the "present-day year" for a biome's `years` array: the largest
 * year strictly before the projected-year threshold (2050), matching the
 * `getPresentYear` concept planned for `ScenarioService` (largest year < 2050,
 * falling back defensively if none exists).
 */
function getPresentYear(years: VaultYearState[]): VaultYearState {
  const historical = years.filter((y) => y.year < PROJECTED_YEAR_THRESHOLD);
  if (historical.length === 0) {
    // Defensive fallback: no historical year exists, so fall back to the earliest year.
    return years.reduce((earliest, y) => (y.year < earliest.year ? y : earliest), years[0]);
  }
  return historical.reduce((latest, y) => (y.year > latest.year ? y : latest), historical[0]);
}

/**
 * Validates: Requirements 4.1, 4.2, 4.3 — every biome's `years` array must have
 * at least 6 entries with pairwise-distinct summaries, at least one projected
 * year (>= 2050) beyond the present-day year, at least one earlier historical
 * year denser/more-pristine than the present-day year, and distinguishable
 * summaries across multiple projected years (e.g. 2050 vs 2075).
 */
describe('timeline expansion — year-array requirements (Requirements 4.1, 4.2, 4.3)', () => {
  for (const [ecosystemId, biome] of Object.entries(vaults)) {
    describe(ecosystemId, () => {
      it('has at least 6 year entries', () => {
        expect(biome.years.length).toBeGreaterThanOrEqual(6);
      });

      it('has pairwise-distinct summary text across all years', () => {
        const summaries = biome.years.map((y) => y.summary);
        const uniqueSummaries = new Set(summaries);
        expect(uniqueSummaries.size).toBe(summaries.length);
      });

      it('has at least one projected year (>= 2050) beyond the present-day year', () => {
        const presentYear = getPresentYear(biome.years);
        const projectedYears = biome.years.filter(
          (y) => y.year >= PROJECTED_YEAR_THRESHOLD && y.year > presentYear.year,
        );
        expect(projectedYears.length).toBeGreaterThanOrEqual(1);
      });

      it('has at least one earlier historical year denser/more-pristine than the present-day year', () => {
        const presentYear = getPresentYear(biome.years);
        const earlierYears = biome.years.filter((y) => y.year < presentYear.year);
        const hasDenserEarlierYear = earlierYears.some(
          (y) =>
            y.metrics.vegetationDensity > presentYear.metrics.vegetationDensity ||
            y.metrics.biodiversityLevel > presentYear.metrics.biodiversityLevel,
        );
        expect(hasDenserEarlierYear).toBe(true);
      });

      it('has distinguishable summaries across 2050 vs 2075 (or all projected years) if two or more exist', () => {
        const projectedYears = biome.years.filter((y) => y.year >= PROJECTED_YEAR_THRESHOLD);
        if (projectedYears.length >= 2) {
          const projectedSummaries = projectedYears.map((y) => y.summary);
          const uniqueProjectedSummaries = new Set(projectedSummaries);
          expect(uniqueProjectedSummaries.size).toBe(projectedSummaries.length);
        }
      });
    });
  }
});
