import * as THREE from 'three';
import { seededRange } from '../../../utils/seededRandom';
import type { TerrainStrategy } from './types';

const DEFAULT_SEAFLOOR_DEPTH = 3;

/**
 * Height always sits at or below the water surface plane (`<= -seafloorDepth`),
 * gentle undulation only, sandy/rocky palette with a blue-green tint blended in —
 * used for the Coral Reef biome.
 */
export const seafloor: TerrainStrategy = {
  computeHeight(ctx, params) {
    const { x, z, index } = ctx;
    const seafloorDepth = params?.seafloorDepth ?? DEFAULT_SEAFLOOR_DEPTH;

    // Gentle undulation only, always non-negative additive offset above the base
    // depth so the floor never protrudes above -seafloorDepth.
    const undulation =
      (Math.sin(x * 0.06 + 1.3) * 0.5 + 0.5) * 0.6 +
      (Math.cos(z * 0.07 - 0.7) * 0.5 + 0.5) * 0.5 +
      seededRange(index * 0.7, 0, 1) * 0.1;

    // undulation is always in [0, ~1.2], so height stays strictly <= -seafloorDepth + 1.2.
    // To guarantee the `<= -seafloorDepth` postcondition exactly, clamp the additive term
    // to 0 (i.e., never allow the floor to rise above the base depth).
    return -seafloorDepth - undulation;
  },

  computeColor(ctx, _height, palette, _params) {
    const { developmentLevel } = ctx;

    const sandy = new THREE.Color(palette.primary);
    const rocky = new THREE.Color(palette.secondary);
    const tint = new THREE.Color('#1f5f66');
    const developed = new THREE.Color(palette.developed);

    let color = sandy.clone().lerp(rocky, 0.4);
    color = color.lerp(tint, 0.35);
    color = color.lerp(developed, developmentLevel * 0.3);

    return color;
  },
};
