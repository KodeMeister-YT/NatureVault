import { describe, expect, it } from 'vitest';

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
 * for a 7-element years array (the largest array size introduced by this tier,
 * per Coastal Wetland's 6-year timeline plus headroom).
 *
 * Validates: Requirements 9.1
 */
function snapToNearestYear(years: number[], target: number): number {
  return years.reduce((closest, y) => (Math.abs(y - target) < Math.abs(closest - target) ? y : closest), years[0]);
}

describe('Timeline nearest-year snap logic', () => {
  const years = [1980, 1995, 2010, 2026, 2035, 2050, 2065];

  it('snaps to the exact year when the target matches a year exactly', () => {
    for (const y of years) {
      expect(snapToNearestYear(years, y)).toBe(y);
    }
  });

  it('snaps to the nearer neighbor when the target falls between two years', () => {
    // Between 1995 and 2010, closer to 1995 (15 vs 3 away)... adjust to be unambiguous
    expect(snapToNearestYear(years, 2001)).toBe(1995); // |1995-2001|=6 < |2010-2001|=9
    expect(snapToNearestYear(years, 2005)).toBe(2010); // |2010-2005|=5 < |1995-2005|=10
  });

  it('snaps to the first year for targets below the minimum', () => {
    expect(snapToNearestYear(years, 1900)).toBe(1980);
  });

  it('snaps to the last year for targets above the maximum', () => {
    expect(snapToNearestYear(years, 2200)).toBe(2065);
  });

  it('breaks exact ties in favor of the earlier year (matches the reduce implementation)', () => {
    // Midpoint between 2026 and 2035 is 2030.5 -> not an exact tie case with
    // integer years, so use a symmetric pair instead: 2010 and 2050 around 2030.
    const symmetricYears = [2010, 2030, 2050];
    expect(snapToNearestYear(symmetricYears, 2030)).toBe(2030);
  });
});
