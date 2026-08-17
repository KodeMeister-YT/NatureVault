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
    const { x, z, developmentLevel } = ctx;
    const amp = params?.duneAmplitude ?? DEFAULT_DUNE_AMPLITUDE;

    const sandLight = new THREE.Color(palette.primary);
    const sandDark = new THREE.Color(palette.secondary);
    const developed = new THREE.Color(palette.developed);
    // Darker, desaturated tan-grey for rocky patches — no green channel dominance,
    // staying consistent with the desert's no-green-hex-value constraint.
    const rockyPatch = new THREE.Color('#6f6455');

    // Higher dune crests read lighter/sun-bleached; troughs read darker.
    const t = THREE.MathUtils.clamp((height / (1.3 * amp) + 1) / 2, 0, 1);
    let color = sandDark.clone().lerp(sandLight, t);

    // Rocky-patch tint: a second, lower-frequency noise term sampled at a different
    // frequency than the height noise and keyed off (x, z) directly rather than
    // height, so rocky ground shows up in irregular patches independent of dune
    // crest/trough position (unlike the height-based sand-light/dark blend above).
    const rockyNoise =
      Math.sin(x * 0.083 + z * 0.061 + 4.1) * 0.5 + Math.cos(x * 0.047 - z * 0.072 - 1.7) * 0.5;
    const rockyPatchAmount = THREE.MathUtils.clamp((rockyNoise - 0.35) / 0.4, 0, 1) * 0.6;
    color = color.lerp(rockyPatch, rockyPatchAmount);

    // Subtle sand-ripple banding: a fine, low-amplitude sine modulation that darkens/
    // lightens the surface slightly so it doesn't read as one flat gradient. Purely a
    // color effect — no geometry change — so it layers on top of both the height
    // gradient and the rocky-patch blend above.
    const ripple = Math.sin(x * 1.1 + z * 0.9) * 0.04;
    color = color.clone();
    color.r = THREE.MathUtils.clamp(color.r + ripple, 0, 1);
    color.g = THREE.MathUtils.clamp(color.g + ripple, 0, 1);
    color.b = THREE.MathUtils.clamp(color.b + ripple * 0.8, 0, 1);

    color = color.lerp(developed, developmentLevel * 0.5);

    return color;
  },
};
