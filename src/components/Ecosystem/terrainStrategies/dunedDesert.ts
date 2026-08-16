import * as THREE from 'three';
import { seededRange } from '../../../utils/seededRandom';
import type { TerrainStrategy } from './types';

const DEFAULT_DUNE_AMPLITUDE = 1.8;

/**
 * Larger-amplitude, lower-frequency undulation than rollingHills, so dunes read
 * as visibly bigger/slower waves of sand rather than small rolling hills.
 */
export const dunedDesert: TerrainStrategy = {
  computeHeight(ctx, params) {
    const { x, z, index, waterInfluence } = ctx;
    const amp = params?.duneAmplitude ?? DEFAULT_DUNE_AMPLITUDE;

    // Lower frequency (bigger dunes) and amplitude scaled by `amp`, which is
    // intentionally > 1 by default so this strategy is always higher-amplitude
    // than rollingHills for the same (x, z) inputs.
    let height =
      Math.sin(x * 0.035 + 1.3) * 0.5 * amp +
      Math.cos(z * 0.04 - 0.7) * 0.45 * amp +
      Math.sin((x + z) * 0.02) * 0.35 * amp;

    height += seededRange(index * 0.7, -1, 1) * 0.08 * amp;

    // Desert biomes have water.kind === 'none', so waterInfluence should always
    // be 0 in practice, but keep the same shoreline-carving contract for safety.
    if (waterInfluence > 0) {
      const basinHeight = -0.75;
      const t = Math.min(1, waterInfluence * 1.4);
      height = height * (1 - t) + basinHeight * t;
    }

    return height;
  },

  computeColor(ctx, height, palette, params) {
    const { developmentLevel } = ctx;
    const amp = params?.duneAmplitude ?? DEFAULT_DUNE_AMPLITUDE;

    const sandLight = new THREE.Color(palette.primary);
    const sandDark = new THREE.Color(palette.secondary);
    const developed = new THREE.Color(palette.developed);

    // Higher dune crests read lighter/sun-bleached; troughs read darker.
    const t = THREE.MathUtils.clamp((height / (1.3 * amp) + 1) / 2, 0, 1);
    let color = sandDark.clone().lerp(sandLight, t);
    color = color.lerp(developed, developmentLevel * 0.5);

    return color;
  },
};
