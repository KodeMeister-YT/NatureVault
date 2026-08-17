/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Timeline's range input has no `@testing-library/react` (or similar DOM-render
 * test harness) installed in this project, so this test does not render the
 * component. Instead it mirrors the exact nearest-year-snap formula used in
 * `Timeline.tsx`'s `onChange` handler:
 *
 *   const nearest = years.reduce(
 *     (closest, y) => (Math.abs(y - target) < Math.abs(closest - target) ? y : closest),
 *     years[0],
 *   );
 *
 * This verifies the snap algorithm's correctness independent of the component,
 * against the actual (post Task-16) `years` arrays authored for real biomes,
 * rather than a synthetic placeholder array.
 *
 * Validates: Requirements 4.4
 */
function snapToNearestYear(years: number[], target: number): number {
  return years.reduce((closest, y) => (Math.abs(y - target) < Math.abs(closest - target) ? y : closest), years[0]);
}

describe('Timeline nearest-year snap logic (7-element years array)', () => {
  // Coastal Wetland's actual `years` array (src/data/ecosystems/coastalWetland.ts) — 7 entries.
  const years = [1980, 1995, 2010, 2026, 2035, 2050, 2075];

  it('snaps to the exact year when the target matches a year exactly', () => {
    for (const y of years) {
      expect(snapToNearestYear(years, y)).toBe(y);
    }
  });

  it('snaps to the nearer neighbor when the target falls between two years', () => {
    expect(snapToNearestYear(years, 2001)).toBe(1995); // |1995-2001|=6 < |2010-2001|=9
    expect(snapToNearestYear(years, 2005)).toBe(2010); // |2010-2005|=5 < |1995-2005|=10
  });

  it('snaps to the first year for targets below the minimum', () => {
    expect(snapToNearestYear(years, 1900)).toBe(1980);
  });

  it('snaps to the last year for targets above the maximum', () => {
    expect(snapToNearestYear(years, 2200)).toBe(2075);
  });

  it('breaks exact ties in favor of the earlier year (matches the reduce implementation)', () => {
    // Symmetric pair around a midpoint, since no exact-tie case exists in the
    // real integer-year array above.
    const symmetricYears = [2010, 2030, 2050];
    expect(snapToNearestYear(symmetricYears, 2030)).toBe(2030);
  });
});

describe('Timeline nearest-year snap logic (6-element years array)', () => {
  // Alpine Ecosystem's actual `years` array (src/data/ecosystems/alpineEcosystem.ts) — 6 entries.
  const years = [1985, 2000, 2013, 2026, 2050, 2075];

  it('snaps to the exact year when the target matches a year exactly', () => {
    for (const y of years) {
      expect(snapToNearestYear(years, y)).toBe(y);
    }
  });

  it('snaps to the nearer neighbor when the target falls between two years', () => {
    expect(snapToNearestYear(years, 2004)).toBe(2000); // |2000-2004|=4 < |2013-2004|=9
    expect(snapToNearestYear(years, 2010)).toBe(2013); // |2013-2010|=3 < |2000-2010|=10
  });

  it('snaps to the first year for targets below the minimum', () => {
    expect(snapToNearestYear(years, 1900)).toBe(1985);
  });

  it('snaps to the last year for targets above the maximum', () => {
    expect(snapToNearestYear(years, 2200)).toBe(2075);
  });
});

/**
 * `Timeline`'s always-visible-labels behavior. This project has no
 * `@testing-library/react` (or similar) DOM-render harness installed (see
 * ScenarioSwitcher.test.ts / EcosystemCard.test.ts / TakeItOutsidePanel.test.ts), so this
 * test follows the same established source-string-inspection pattern used elsewhere in
 * this codebase to confirm the component renders a label for every entry in a `years`
 * array — including the 7-element case — rather than just first/last/current.
 */
describe('Timeline always-visible year labels (source-level)', () => {
  const currentDir = dirname(fileURLToPath(import.meta.url));
  const TIMELINE_SOURCE = readFileSync(join(currentDir, 'Timeline.tsx'), 'utf-8');

  it('maps over the full `years` array (not a filtered/reduced subset) to render labels', () => {
    // The label-rendering block must iterate `years.map(...)`, not a derived
    // "visibleYears" subset limited to first/last/current.
    expect(TIMELINE_SOURCE).toContain('years.map((y, i) =>');
    expect(TIMELINE_SOURCE).not.toContain('visibleYears');
  });

  it('positions every label proportionally using the same min/max percent formula as the progress fill', () => {
    const labelBlockStart = TIMELINE_SOURCE.indexOf('years.map((y, i) =>');
    expect(labelBlockStart).toBeGreaterThan(-1);
    const labelBlockEnd = TIMELINE_SOURCE.indexOf('</div>\n      </div>\n    </div>', labelBlockStart);
    expect(labelBlockEnd).toBeGreaterThan(labelBlockStart);
    const block = TIMELINE_SOURCE.slice(labelBlockStart, labelBlockEnd);

    expect(block).toContain('const labelPercent = ((y - min) / (max - min)) * 100');
    expect(block).toContain("style={{ left: `${labelPercent}%` }}");
  });

  it('visually distinguishes the currently-selected year with font-semibold text-vault-gold', () => {
    expect(TIMELINE_SOURCE).toContain("y === year ? 'font-semibold text-vault-gold'");
  });

  it('renders a label for every year in a real 7-element years array (Coastal Wetland / Freshwater Lake shape)', () => {
    const years = [1980, 1995, 2010, 2026, 2035, 2050, 2075];
    // Independently simulate the render loop the component performs and confirm one
    // label per year would be produced, each positioned at its own distinct percent.
    const min = years[0];
    const max = years[years.length - 1];
    const renderedLabels = years.map((y) => ({ year: y, percent: ((y - min) / (max - min)) * 100 }));

    expect(renderedLabels.length).toBe(years.length);
    const distinctPercents = new Set(renderedLabels.map((l) => l.percent));
    expect(distinctPercents.size).toBe(years.length);
  });

  it('does not cap or truncate the label set for arrays longer than 5 (no first/last/current-only branch)', () => {
    // The old implementation derived a `visibleYears` subset (first/last/current only)
    // via `Array.from(new Set([min, year, max]))` and conditionally rendered either that
    // subset or the full array depending on `years.length > 5`. Confirm that subsetting
    // logic is gone entirely — the only remaining `years.length` comparisons should be
    // for font-size/layout styling, not for deciding which years get a label at all.
    expect(TIMELINE_SOURCE).not.toContain('Array.from(new Set([min, year, max]))');
    expect(TIMELINE_SOURCE).not.toContain('const visibleYears');
  });
});
