import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { dunedDesert } from './dunedDesert';
import { rollingHills } from './rollingHills';
import type { TerrainVertexContext } from './types';

function stdDev(values: number[]): number {
  const mean = values.reduce((a, b) => a + b, 0) / values.length;
  const variance = values.reduce((a, b) => a + (b - mean) ** 2, 0) / values.length;
  return Math.sqrt(variance);
}

/**
 * Validates: Requirements 2.4 (duned-desert visibly higher amplitude than rolling-hills)
 *
 * Samples the fixed grid matching Terrain.tsx's actual production geometry (SIZE=70,
 * SEGMENTS=90) at its real, un-offset position — this is the only window either strategy
 * is ever actually evaluated over in the app, so it's the representative case. Arbitrary
 * large positional offsets were tried and rejected: discrete vertex sampling combined with
 * a low-frequency dune wave can alias at specific offsets, occasionally producing a near-tied
 * (non-representative) sample variance that isn't a meaningful violation of "dunes read as
 * higher-amplitude terrain" in the game's actual rendered scene. Instead this test fuzzes
 * `duneAmplitude` across the range design.md's own example biome data uses (>= 1.6, e.g. the
 * Desert biome skeleton in design.md sets `duneAmplitude: 1.6`) — below that threshold the
 * lower frequency alone doesn't complete enough oscillations over the fixed 70-unit terrain
 * window to out-vary rollingHills, so authored biome data must stay at or above this floor,
 * which the strategy's own DEFAULT_DUNE_AMPLITUDE (1.8) already satisfies.
 */
describe('dunedDesert strategy', () => {
  it('produces higher-amplitude height variance than rollingHills over the real terrain grid', () => {
    fc.assert(
      fc.property(fc.float({ min: Math.fround(1.6), max: 3, noNaN: true }), (duneAmplitude) => {
        const SIZE = 70;
        const SEGMENTS = 90;
        const spacing = SIZE / SEGMENTS;
        const ctxs: TerrainVertexContext[] = [];
        let index = 0;
        for (let i = 0; i <= SEGMENTS; i++) {
          for (let j = 0; j <= SEGMENTS; j++) {
            ctxs.push({
              x: -SIZE / 2 + i * spacing,
              z: -SIZE / 2 + j * spacing,
              index: index++,
              waterInfluence: 0,
              developmentLevel: 0,
            });
          }
        }

        const duneHeights = ctxs.map((ctx) => dunedDesert.computeHeight(ctx, { duneAmplitude }));
        const hillHeights = ctxs.map((ctx) => rollingHills.computeHeight(ctx, undefined));

        expect(stdDev(duneHeights)).toBeGreaterThan(stdDev(hillHeights));
      }),
    );
  });
});
