import type { VaultStateMetrics } from '../types/vault';
import type { Scenario } from '../types/scenario';
import { getScenarioById } from '../data/scenarios';

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Applies a scenario's illustrative modifiers to a baseline set of metrics.
 * Modifiers are expressed as percentage-point deltas (e.g. -25 means -0.25).
 * This is a simple visual simulation, not a scientific model.
 */
export function applyScenario(baseline: VaultStateMetrics, scenario: Scenario): VaultStateMetrics {
  const { modifiers } = scenario;
  return {
    vegetationDensity: clamp01(baseline.vegetationDensity + modifiers.forestCoverage / 100),
    waterLevel: clamp01(baseline.waterLevel + modifiers.waterLevel / 100),
    biodiversityLevel: clamp01(baseline.biodiversityLevel + modifiers.biodiversity / 100),
    developmentLevel: clamp01(baseline.developmentLevel + modifiers.urbanDevelopment / 100),
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
  const isFutureYear = year === Math.max(...baselineByYear.map((y) => y.year));
  if (isFutureYear && scenarioId) {
    const scenario = getScenarioById(scenarioId);
    const previous = baselineByYear[baselineByYear.length - 2]?.metrics ?? state.metrics;
    if (scenario) return applyScenario(previous, scenario);
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
