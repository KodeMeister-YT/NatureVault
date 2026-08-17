/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { computeScenarioImpactSummary } from './ScenarioSwitcher';
import { resolveMetricsForYear } from '../../services/ScenarioService';
import type { VaultYearState } from '../../types/vault';

/**
 * `computeScenarioImpactSummary` and `ScenarioSwitcher`'s "Illustrative
 * simulation — not a scientific forecast" caption. This project has no
 * `@testing-library/react` (or similar) DOM-render harness installed (see
 * Timeline.test.ts), so this test exercises the exported pure function
 * directly rather than rendering `<ScenarioSwitcher>`, and verifies the
 * caption invariant via a source-string check against ScenarioSwitcher.tsx
 * (the caption is rendered unconditionally inside the same `{impactSummary && (...)}`
 * block that renders `impactSummary.label`, so "non-null summary implies
 * caption renders" holds by construction — this test guards against that
 * invariant ever being broken by a future edit).
 *
 * Validates: Requirements 5.4, 5.5
 */

const currentDir = dirname(fileURLToPath(import.meta.url));
const SCENARIO_SWITCHER_SOURCE = readFileSync(join(currentDir, 'ScenarioSwitcher.tsx'), 'utf-8');

const presentYear = 2026;
const projectedYear = 2050;

const baselineMetrics = {
  vegetationDensity: 0.6,
  waterLevel: 0.5,
  biodiversityLevel: 0.55,
  developmentLevel: 0.3,
};

const projectedBaselineMetrics = {
  vegetationDensity: 0.45,
  waterLevel: 0.4,
  biodiversityLevel: 0.4,
  developmentLevel: 0.5,
};

const years: VaultYearState[] = [
  {
    year: presentYear,
    label: 'Present Day',
    metrics: baselineMetrics,
    summary: 'Present-day baseline conditions.',
    keyChanges: ['Baseline established'],
  },
  {
    year: projectedYear,
    label: 'Projected 2050',
    metrics: projectedBaselineMetrics,
    summary: 'A projected future state under continued pressure.',
    keyChanges: ['Projected change'],
  },
];

describe('computeScenarioImpactSummary', () => {
  it('derives deltaPercent purely from two independently-called resolveMetricsForYear results', () => {
    const summary = computeScenarioImpactSummary(years, projectedYear);
    expect(summary).not.toBeNull();

    // Independently compute the expected delta via the same production
    // function calls used inside computeScenarioImpactSummary — no
    // hand-authored constant duplicated here.
    const continueMetrics = resolveMetricsForYear(years, projectedYear, 'continue-as-is');
    const protectMetrics = resolveMetricsForYear(years, projectedYear, 'protect-and-restore');
    const expectedDeltaPercent = Math.round(
      (protectMetrics.biodiversityLevel - continueMetrics.biodiversityLevel) * 100,
    );

    expect(summary?.deltaPercent).toBe(expectedDeltaPercent);
  });

  it('returns a label string reflecting the same deltaPercent', () => {
    const summary = computeScenarioImpactSummary(years, projectedYear);
    expect(summary).not.toBeNull();
    expect(summary?.label).toContain(`${summary?.deltaPercent}%`);
    expect(summary?.label.toLowerCase()).toContain('biodiversity');
  });

  it('returns null when the requested year is not a projected year (year <= presentYear)', () => {
    expect(computeScenarioImpactSummary(years, presentYear)).toBeNull();
    expect(computeScenarioImpactSummary(years, presentYear - 10)).toBeNull();
  });

  it('returns null for an empty years array', () => {
    expect(computeScenarioImpactSummary([], projectedYear)).toBeNull();
  });
});

describe('ScenarioSwitcher "Illustrative simulation" caption invariant', () => {
  it('renders the exact required caption text in the component source', () => {
    expect(SCENARIO_SWITCHER_SOURCE).toContain('Illustrative simulation — not a scientific forecast');
  });

  it('renders the caption inside the same conditional block that renders impactSummary.label', () => {
    // Locate the `{impactSummary && (` block and confirm both the label
    // interpolation and the caption text live within it, so that whenever
    // computeScenarioImpactSummary returns non-null (impactSummary truthy),
    // the caption is guaranteed to render alongside the label — satisfying
    // Requirement 5.5's "label renders whenever the summary is shown" intent
    // without a DOM-render harness.
    const blockStart = SCENARIO_SWITCHER_SOURCE.indexOf('{impactSummary && (');
    expect(blockStart).toBeGreaterThan(-1);

    const blockEnd = SCENARIO_SWITCHER_SOURCE.indexOf(')}', blockStart);
    expect(blockEnd).toBeGreaterThan(blockStart);

    const block = SCENARIO_SWITCHER_SOURCE.slice(blockStart, blockEnd);
    expect(block).toContain('impactSummary.label');
    expect(block).toContain('Illustrative simulation — not a scientific forecast');
  });
});
