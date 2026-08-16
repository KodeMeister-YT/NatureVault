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

  it.each([2, 3, 7])('resolveMetricsForYear treats the LAST year as the future/scenario-eligible year for a %i-year array', (count) => {
    const years = buildYears(count);
    const lastYear = years[years.length - 1];

    // Without a scenario id, the base metrics for the last year are returned unchanged.
    const withoutScenario = resolveMetricsForYear(years, lastYear.year);
    expect(withoutScenario).toEqual(lastYear.metrics);

    // With a real registered scenario id, the last year is recognized as the
    // "future" year eligible for scenario application (applied on top of the
    // second-to-last year's metrics, per resolveMetricsForYear's implementation).
    const withScenario = resolveMetricsForYear(years, lastYear.year, continueAsIs.id);
    const expectedPrevious = years[years.length - 2]?.metrics ?? lastYear.metrics;
    expect(withScenario).toEqual(applyScenario(expectedPrevious, continueAsIs));
    expect(withScenario).not.toEqual(lastYear.metrics);
  });

  it.each([2, 3, 7])('resolveMetricsForYear does NOT apply a scenario to a non-last year in a %i-year array', (count) => {
    const years = buildYears(count);
    if (years.length < 2) return;
    const midIndex = Math.floor((years.length - 1) / 2);
    const midYear = years[midIndex];
    // Skip if midYear happens to be the last year (only possible for length 1, excluded above).
    const result = resolveMetricsForYear(years, midYear.year, continueAsIs.id);
    expect(result).toEqual(midYear.metrics);
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
