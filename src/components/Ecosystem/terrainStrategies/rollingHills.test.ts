import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { rollingHills } from './rollingHills';
import type { TerrainVertexContext } from './types';

const palette = { primary: '#3d5a34', secondary: '#6b6a45', shoreline: '#5a4a34', developed: '#54524a' };

const ctxArb = fc.record({
  x: fc.float({ min: -50, max: 50, noNaN: true }),
  z: fc.float({ min: -50, max: 50, noNaN: true }),
  index: fc.integer({ min: 0, max: 10000 }),
  waterInfluence: fc.float({ min: 0, max: 1, noNaN: true }),
  developmentLevel: fc.float({ min: 0, max: 1, noNaN: true }),
});

/**
 * Validates: Requirements 2.7 (terrain strategy determinism, Property 7 in design.md)
 */
describe('rollingHills strategy', () => {
  it('computeHeight and computeColor are pure/deterministic for repeated calls with identical input', () => {
    fc.assert(
      fc.property(ctxArb, (ctx: TerrainVertexContext) => {
        const h1 = rollingHills.computeHeight(ctx, undefined);
        const h2 = rollingHills.computeHeight(ctx, undefined);
        expect(h1).toBe(h2);

        const c1 = rollingHills.computeColor(ctx, h1, palette, undefined);
        const c2 = rollingHills.computeColor(ctx, h1, palette, undefined);
        expect(c1.r).toBe(c2.r);
        expect(c1.g).toBe(c2.g);
        expect(c1.b).toBe(c2.b);
      }),
    );
  });

  it('computeColor always returns RGB components within [0,1]', () => {
    fc.assert(
      fc.property(ctxArb, (ctx: TerrainVertexContext) => {
        const height = rollingHills.computeHeight(ctx, undefined);
        const color = rollingHills.computeColor(ctx, height, palette, undefined);
        expect(color.r).toBeGreaterThanOrEqual(0);
        expect(color.r).toBeLessThanOrEqual(1);
        expect(color.g).toBeGreaterThanOrEqual(0);
        expect(color.g).toBeLessThanOrEqual(1);
        expect(color.b).toBeGreaterThanOrEqual(0);
        expect(color.b).toBeLessThanOrEqual(1);
      }),
    );
  });
});
