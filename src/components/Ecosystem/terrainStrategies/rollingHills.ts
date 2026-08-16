import * as THREE from 'three';
import { seededRange } from '../../../utils/seededRandom';
import type { TerrainStrategy } from './types';

/**
 * Default rolling-hills strategy — extracted from the original single-purpose
 * Terrain.tsx implementation. Height combines layered sine noise with a seeded
 * per-vertex jitter; color blends a grass/shoreline/developed palette based on
 * height and proximity to water (waterInfluence).
 */
export const rollingHills: TerrainStrategy = {
  computeHeight(ctx) {
    const { x, z, index, waterInfluence } = ctx;

    let height = Math.sin(x * 0.09 + 1.3) * 0.5 + Math.cos(z * 0.11 - 0.7) * 0.45 + Math.sin((x + z) * 0.05) * 0.35;

    // Small random jitter per-vertex for a less mathematically perfect look.
    height += seededRange(index * 0.7, -1, 1) * 0.08;

    // Carve a basin around nearby water so terrain never buries the water mesh.
    if (waterInfluence > 0) {
      const basinHeight = -0.75;
      const t = Math.min(1, waterInfluence * 1.4);
      height = height * (1 - t) + basinHeight * t;
    }

    return height;
  },

  computeColor(ctx, height, palette, _params) {
    const { waterInfluence, developmentLevel } = ctx;

    const grassLush = new THREE.Color(palette.primary);
    const grassDry = new THREE.Color(palette.secondary);
    const mud = new THREE.Color(palette.shoreline ?? palette.secondary);
    const sand = mud.clone().lerp(new THREE.Color('#d8c9a0'), 0.55);
    const developed = new THREE.Color(palette.developed);

    let color: THREE.Color;
    if (waterInfluence > 0.55) {
      color = mud.clone().lerp(sand, Math.min(1, waterInfluence - 0.55) * 2);
    } else if (waterInfluence > 0.25) {
      color = mud.clone().lerp(grassLush, 0.35);
    } else if (height > 1.1) {
      color = grassDry.clone();
    } else {
      color = grassLush.clone().lerp(grassDry, Math.max(0, (height + 0.3) / 2));
    }
    color = color.lerp(developed, developmentLevel * 0.5);

    return color;
  },
};
