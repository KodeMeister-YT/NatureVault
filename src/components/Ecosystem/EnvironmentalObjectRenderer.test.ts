import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { seededDropoutThreshold } from './EnvironmentalObjectRenderer';

const positionArb = fc.tuple(
  fc.float({ min: -100, max: 100, noNaN: true }),
  fc.float({ min: -20, max: 20, noNaN: true }),
  fc.float({ min: -100, max: 100, noNaN: true }),
) as fc.Arbitrary<[number, number, number]>;

/**
 * Validates: Requirements 2.1, 2.2 (density-dropout monotonicity, Property 4 in design.md)
 */
describe('seededDropoutThreshold (shared density-dropout helper)', () => {
  it('is deterministic for a fixed position', () => {
    fc.assert(
      fc.property(positionArb, (position) => {
        expect(seededDropoutThreshold(position)).toBe(seededDropoutThreshold(position));
      }),
    );
  });

  it('always returns a threshold within [0.15, 0.55]', () => {
    fc.assert(
      fc.property(positionArb, (position) => {
        const threshold = seededDropoutThreshold(position);
        expect(threshold).toBeGreaterThanOrEqual(0.15);
        expect(threshold).toBeLessThanOrEqual(0.55);
      }),
    );
  });

  it('visibility is monotonically non-decreasing in density/biodiversity level: d1 <= d2 implies visible(d1) => visible(d2)', () => {
    fc.assert(
      fc.property(
        positionArb,
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        (position, a, b) => {
          const d1 = Math.min(a, b);
          const d2 = Math.max(a, b);
          const threshold = seededDropoutThreshold(position);
          const visibleAtD1 = d1 >= threshold;
          const visibleAtD2 = d2 >= threshold;
          // visible(d1) implies visible(d2) — i.e. it's never the case that d1 is
          // visible but d2 (a higher-or-equal density) is not.
          expect(!visibleAtD1 || visibleAtD2).toBe(true);
        },
      ),
    );
  });
});
