import type { VaultStateMetrics } from '../types/vault';
import type { Scenario } from '../types/scenario';
import { getScenarioById } from '../data/scenarios';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/** A year a biome is considered to have "arrived at the future" from onward (Glossary: Projected year). */
const PROJECTED_YEAR_THRESHOLD = 2050;

/**
 * Finds the biome's present-day year: the largest year that is still before
 * `PROJECTED_YEAR_THRESHOLD`. Defensively falls back to the second-to-last
 * year (or the only/earliest year, for very short arrays) if every year in
 * `baselineByYear` is already `>= PROJECTED_YEAR_THRESHOLD` — this should
 * never occur for an authored biome, but keeps the function total.
 */
export function getPresentYear(baselineByYear: { year: number; metrics: VaultStateMetrics }[]): number {
  const priorYears = baselineByYear.map((y) => y.year).filter((y) => y < PROJECTED_YEAR_THRESHOLD);
  if (priorYears.length > 0) {
    return Math.max(...priorYears);
  }
  // Defensive fallback: no year below the threshold exists.
  if (baselineByYear.length >= 2) {
    return baselineByYear[baselineByYear.length - 2].year;
  }
  return baselineByYear[baselineByYear.length - 1].year;
}

/**
 * Applies a scenario's illustrative modifiers to a baseline set of metrics.
 * Modifiers are expressed as percentage-point deltas (e.g. -25 means -0.25).
 * `scale` (default 1) multiplies each modifier's delta before it's applied,
 * so a later projected year can diverge further than an earlier one under
 * the same scenario. This is a simple visual simulation, not a scientific model.
 */
export function applyScenario(baseline: VaultStateMetrics, scenario: Scenario, scale = 1): VaultStateMetrics {
  const { modifiers } = scenario;
  return {
    vegetationDensity: clamp01(baseline.vegetationDensity + (modifiers.forestCoverage * scale) / 100),
    waterLevel: clamp01(baseline.waterLevel + (modifiers.waterLevel * scale) / 100),
    biodiversityLevel: clamp01(baseline.biodiversityLevel + (modifiers.biodiversity * scale) / 100),
    developmentLevel: clamp01(baseline.developmentLevel + (modifiers.urbanDevelopment * scale) / 100),
  };
}

export function resolveMetricsForYear(
  baselineByYear: { year: number; metrics: VaultStateMetrics }[],
  year: number,
  scenarioId?: string,
): VaultStateMetrics {
  const state = baselineByYear.find((y) => y.year === year);
  if (!state) {
    // fall back to the last known year
    return baselineByYear[baselineByYear.length - 1].metrics;
  }

  const presentYear = getPresentYear(baselineByYear);
  const projectedYears = baselineByYear
    .map((y) => y.year)
    .filter((y) => y > presentYear)
    .sort((a, b) => a - b);
  const isProjectedYear = projectedYears.includes(year);

  if (isProjectedYear && scenarioId) {
    const scenario = getScenarioById(scenarioId);
    const previous = baselineByYear.find((y) => y.year === presentYear)?.metrics ?? state.metrics;
    if (scenario) {
      const firstProjectedYear = projectedYears[0];
      const scale =
        firstProjectedYear === presentYear ? 1 : (year - presentYear) / (firstProjectedYear - presentYear);
      return applyScenario(previous, scenario, scale);
    }
  }
  return state.metrics;
}

/** Linearly interpolate between two metric sets, t in [0,1] */
export function lerpMetrics(a: VaultStateMetrics, b: VaultStateMetrics, t: number): VaultStateMetrics {
  const lerp = (x: number, y: number) => x + (y - x) * t;
  return {
    vegetationDensity: lerp(a.vegetationDensity, b.vegetationDensity),
    waterLevel: lerp(a.waterLevel, b.waterLevel),
    biodiversityLevel: lerp(a.biodiversityLevel, b.biodiversityLevel),
    developmentLevel: lerp(a.developmentLevel, b.developmentLevel),
  };
}
