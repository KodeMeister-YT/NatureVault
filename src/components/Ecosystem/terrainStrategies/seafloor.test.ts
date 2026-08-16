import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { seafloor } from './seafloor';

/**
 * Validates: Requirements 2.6 (seafloor stays at/below water plane)
 */
describe('seafloor strategy', () => {
  it('computeHeight always returns a value <= -seafloorDepth', () => {
    fc.assert(
      fc.property(
        fc.record({
          x: fc.float({ min: -50, max: 50, noNaN: true }),
          z: fc.float({ min: -50, max: 50, noNaN: true }),
          index: fc.integer({ min: 0, max: 10000 }),
          waterInfluence: fc.constant(0),
          developmentLevel: fc.float({ min: 0, max: 1, noNaN: true }),
        }),
        fc.float({ min: 0.5, max: 10, noNaN: true }),
        (ctx, seafloorDepth) => {
          const height = seafloor.computeHeight(ctx, { seafloorDepth });
          expect(height).toBeLessThanOrEqual(-seafloorDepth);
        },
      ),
    );
  });
});
