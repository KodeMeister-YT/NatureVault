import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { applyScenario, lerpMetrics, resolveMetricsForYear } from './ScenarioService';
import type { VaultStateMetrics } from '../types/vault';
import type { Scenario } from '../types/scenario';
import { continueAsIs } from '../data/scenarios';

/**
 * Regression guard confirming design.md's claim that ScenarioService "already
 * generalizes" to variable-length years arrays and requires no changes for
 * Tier 6. ScenarioService.ts itself is NOT modified by this test file.
 *
 * Validates: Requirements 9.3
 */

const metrics = (n: number): VaultStateMetrics => ({
  vegetationDensity: n,
  waterLevel: n,
  biodiversityLevel: n,
  developmentLevel: n,
});

const testScenario: Scenario = {
  id: 'test-scenario',
  name: 'Test Scenario',
  description: 'A synthetic scenario for regression testing.',
  assumptions: [],
  environmentalChanges: [],
  modifiers: {
    forestCoverage: 10,
    waterLevel: 10,
    biodiversity: 10,
    urbanDevelopment: 10,
  },
};

function buildYears(count: number): { year: number; metrics: VaultStateMetrics }[] {
  return Array.from({ length: count }, (_, i) => ({
    year: 2000 + i * 10,
    metrics: metrics(0.1 * (i + 1)),
  }));
}

describe('ScenarioService generalizes across N-length years arrays', () => {
  it.each([2, 3, 7])('resolveMetricsForYear finds the matching year for a %i-year array', (count) => {
    const years = buildYears(count);
    const midIndex = Math.floor((years.length - 1) / 2);
    const midYear = years[midIndex];
    const result = resolveMetricsForYear(years, midYear.year);
    expect(result).toEqual(midYear.metrics);
  });

  it.each([2, 3])(
    'resolveMetricsForYear does NOT apply a scenario when every year is before the 2050 projected-year threshold (%i-year array)',
    (count) => {
      const years = buildYears(count);
      const lastYear = years[years.length - 1];

      // All synthetic years for these counts are < 2050 (2000, 2010, 2020), so none
      // of them qualify as a "projected year" under the new threshold-based logic —
      // the last year is just the present year, not a scenario-eligible future year.
      const withoutScenario = resolveMetricsForYear(years, lastYear.year);
      expect(withoutScenario).toEqual(lastYear.metrics);

      const withScenario = resolveMetricsForYear(years, lastYear.year, continueAsIs.id);
      expect(withScenario).toEqual(lastYear.metrics);
    },
  );

  it.each([2, 3])(
    'resolveMetricsForYear does NOT apply a scenario to a non-projected mid year in a %i-year array',
    (count) => {
      const years = buildYears(count);
      const midIndex = Math.floor((years.length - 1) / 2);
      const midYear = years[midIndex];
      const result = resolveMetricsForYear(years, midYear.year, continueAsIs.id);
      expect(result).toEqual(midYear.metrics);
    },
  );

  it('resolveMetricsForYear applies a scaled scenario across multiple projected years (7-year array crossing the 2050 threshold)', () => {
    // 2000, 2010, ..., 2060 — presentYear is 2040 (largest year < 2050), and
    // 2050/2060 are both projected years, diverging by different amounts.
    const years = buildYears(7);
    const presentYear = years.find((y) => y.year === 2040)!;
    const firstProjected = years.find((y) => y.year === 2050)!;
    const secondProjected = years.find((y) => y.year === 2060)!;

    // Without a scenario id, base metrics are returned unchanged for both projected years.
    expect(resolveMetricsForYear(years, firstProjected.year)).toEqual(firstProjected.metrics);
    expect(resolveMetricsForYear(years, secondProjected.year)).toEqual(secondProjected.metrics);

    // The first projected year applies the scenario at scale 1 (full modifier), on top
    // of the present year's metrics.
    const firstWithScenario = resolveMetricsForYear(years, firstProjected.year, continueAsIs.id);
    expect(firstWithScenario).toEqual(applyScenario(presentYear.metrics, continueAsIs, 1));

    // The second (later) projected year applies a larger scale — (2060-2040)/(2050-2040) = 2 —
    // so it diverges further from the present than the first projected year does.
    const secondWithScenario = resolveMetricsForYear(years, secondProjected.year, continueAsIs.id);
    expect(secondWithScenario).toEqual(applyScenario(presentYear.metrics, continueAsIs, 2));

    // Non-projected years (<= presentYear) are unaffected by scenarioId.
    const result = resolveMetricsForYear(years, presentYear.year, continueAsIs.id);
    expect(result).toEqual(presentYear.metrics);
  });

  it.each([2, 3, 7])('resolveMetricsForYear falls back sensibly for an unmatched year in a %i-year array', (count) => {
    const years = buildYears(count);
    const unmatchedYear = 999999;
    const result = resolveMetricsForYear(years, unmatchedYear);
    expect(result).toEqual(years[years.length - 1].metrics);
  });

  it('lerpMetrics interpolates linearly between two metric sets regardless of array length context', () => {
    const a = metrics(0);
    const b = metrics(1);
    expect(lerpMetrics(a, b, 0.5)).toEqual(metrics(0.5));
    expect(lerpMetrics(a, b, 0)).toEqual(metrics(0));
    expect(lerpMetrics(a, b, 1)).toEqual(metrics(1));
  });

  it('applyScenario applies modifiers on top of a baseline regardless of years-array length context', () => {
    const baseline = metrics(0.5);
    const result = applyScenario(baseline, testScenario);
    expect(result.vegetationDensity).toBeCloseTo(0.6);
    expect(result.waterLevel).toBeCloseTo(0.6);
    expect(result.biodiversityLevel).toBeCloseTo(0.6);
    expect(result.developmentLevel).toBeCloseTo(0.6);
  });
});

/**
 * Shared arbitraries for the Property 5 / Property 6 tests below (Task 18.1).
 */
const boundedMetricArb = fc.record({
  vegetationDensity: fc.float({ min: 0, max: 1, noNaN: true }),
  waterLevel: fc.float({ min: 0, max: 1, noNaN: true }),
  biodiversityLevel: fc.float({ min: 0, max: 1, noNaN: true }),
  developmentLevel: fc.float({ min: 0, max: 1, noNaN: true }),
});

const wideModifiersArb = fc.record({
  forestCoverage: fc.float({ min: -500, max: 500, noNaN: true }),
  waterLevel: fc.float({ min: -500, max: 500, noNaN: true }),
  biodiversity: fc.float({ min: -500, max: 500, noNaN: true }),
  urbanDevelopment: fc.float({ min: -500, max: 500, noNaN: true }),
});

function buildTestScenario(modifiers: Scenario['modifiers'], id: string): Scenario {
  return {
    id,
    name: 'PBT Scenario',
    description: 'Randomly generated scenario for property-based testing.',
    assumptions: [],
    environmentalChanges: [],
    modifiers,
  };
}

/**
 * Property-based test (Property 5 — Scenario divergence scaling): for any
 * present year `p` and two projected years `y1 < y2` (both `> p`), the scaled
 * modifier magnitude applied at `y2` (scale = (y2-p)/(y1-p), per
 * ScenarioService's resolveMetricsForYear formula) is >= the magnitude applied
 * at `y1` (scale = 1, since y1 is the first projected year). When a biome has
 * exactly one projected year, the scale factor at that year is always exactly 1.
 *
 * Validates: Requirements 5.1, 5.2
 */
describe('applyScenario scenario divergence scaling (Property 5)', () => {
  it('a later projected year diverges from baseline by >= the magnitude of an earlier projected year', () => {
    fc.assert(
      fc.property(
        boundedMetricArb,
        wideModifiersArb,
        fc.integer({ min: 1900, max: 2049 }), // presentYear
        fc.integer({ min: 2050, max: 2250 }), // y1 (first projected year)
        fc.integer({ min: 1, max: 200 }), // offset from y1 to y2
        (baseline, modifiers, presentYear, y1, offsetToY2) => {
          const y2 = y1 + offsetToY2; // presentYear < y1 < y2, by construction
          const scenario = buildTestScenario(modifiers, 'pbt-divergence-scenario');

          // Per design.md's formula: scale at the first projected year (y1) is
          // always exactly 1; scale at a later projected year (y2) relative to
          // y1 is (y2 - presentYear) / (y1 - presentYear).
          const scaleAtY1 = 1;
          const scaleAtY2 = (y2 - presentYear) / (y1 - presentYear);

          const baselineTyped = baseline as VaultStateMetrics;
          const resultAtY1 = applyScenario(baselineTyped, scenario, scaleAtY1);
          const resultAtY2 = applyScenario(baselineTyped, scenario, scaleAtY2);

          for (const key of Object.keys(baselineTyped) as (keyof VaultStateMetrics)[]) {
            const divergenceAtY1 = Math.abs(resultAtY1[key] - baselineTyped[key]);
            const divergenceAtY2 = Math.abs(resultAtY2[key] - baselineTyped[key]);
            expect(divergenceAtY2).toBeGreaterThanOrEqual(divergenceAtY1 - 1e-9);
          }
        },
      ),
    );
  });

  it('a single projected year always applies the scenario modifier at scale exactly 1 (default)', () => {
    fc.assert(
      fc.property(boundedMetricArb, wideModifiersArb, (baseline, modifiers) => {
        const scenario = buildTestScenario(modifiers, 'pbt-single-projection-scenario');
        const baselineTyped = baseline as VaultStateMetrics;
        const explicitScaleOne = applyScenario(baselineTyped, scenario, 1);
        const defaultScale = applyScenario(baselineTyped, scenario);
        expect(explicitScaleOne).toEqual(defaultScale);
      }),
    );
  });
});

/**
 * Property-based test (Property 6 — Scenario-scaled metrics stay bounded):
 * for any baseline VaultStateMetrics, any scenario modifiers, and any scale
 * factor in [0,1], applyScenario's output stays within [0,1]^4.
 *
 * Validates: Requirements 5.3
 */
describe('applyScenario scenario-scaled metrics stay bounded (Property 6)', () => {
  it('keeps every output field within [0,1] for any baseline, modifiers, and scale in [0,1]', () => {
    fc.assert(
      fc.property(
        boundedMetricArb,
        wideModifiersArb,
        fc.float({ min: 0, max: 1, noNaN: true }),
        (baseline, modifiers, scale) => {
          const scenario = buildTestScenario(modifiers, 'pbt-bounded-scenario');
          const result = applyScenario(baseline as VaultStateMetrics, scenario, scale);
          for (const value of Object.values(result)) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        },
      ),
    );
  });

  it('also keeps every output field within [0,1] for scale factors beyond 1 (real formula can exceed 1 for later projected years)', () => {
    fc.assert(
      fc.property(
        boundedMetricArb,
        wideModifiersArb,
        fc.float({ min: 0, max: 5, noNaN: true }),
        (baseline, modifiers, scale) => {
          const scenario = buildTestScenario(modifiers, 'pbt-bounded-scenario-extended');
          const result = applyScenario(baseline as VaultStateMetrics, scenario, scale);
          for (const value of Object.values(result)) {
            expect(value).toBeGreaterThanOrEqual(0);
            expect(value).toBeLessThanOrEqual(1);
          }
        },
      ),
    );
  });
});

/**
 * Property-based test (P2): applyScenario's output metrics must always stay
 * within [0,1] for each of the four VaultStateMetrics fields, regardless of
 * how extreme the baseline or scenario modifiers are.
 *
 * Validates: Requirements 9.3
 */
describe('applyScenario (P2 — metrics stay within [0,1])', () => {
  const metricArb = fc.record({
    vegetationDensity: fc.float({ min: 0, max: 1, noNaN: true }),
    waterLevel: fc.float({ min: 0, max: 1, noNaN: true }),
    biodiversityLevel: fc.float({ min: 0, max: 1, noNaN: true }),
    developmentLevel: fc.float({ min: 0, max: 1, noNaN: true }),
  });

  const modifiersArb = fc.record({
    forestCoverage: fc.float({ min: -150, max: 150, noNaN: true }),
    waterLevel: fc.float({ min: -150, max: 150, noNaN: true }),
    biodiversity: fc.float({ min: -150, max: 150, noNaN: true }),
    urbanDevelopment: fc.float({ min: -150, max: 150, noNaN: true }),
  });

  const scenarioArb = modifiersArb.map(
    (modifiers): Scenario => ({
      id: 'pbt-scenario',
      name: 'PBT Scenario',
      description: 'Randomly generated scenario for property-based testing.',
      assumptions: [],
      environmentalChanges: [],
      modifiers,
    }),
  );

  it('keeps every output field within [0,1] for any baseline and any modifier magnitude', () => {
    fc.assert(
      fc.property(metricArb, scenarioArb, (baseline, scenario) => {
        const result = applyScenario(baseline as VaultStateMetrics, scenario);
        for (const value of Object.values(result)) {
          expect(value).toBeGreaterThanOrEqual(0);
          expect(value).toBeLessThanOrEqual(1);
        }
      }),
    );
  });
});
