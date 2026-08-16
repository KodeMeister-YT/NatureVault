import * as THREE from 'three';
import { seededRange } from '../../../utils/seededRandom';
import type { TerrainStrategy } from './types';

/**
 * Near-flat terrain with minimal height variance — savanna / grassland,
 * freshwater lake shoreline.
 */
export const flatGrassland: TerrainStrategy = {
  computeHeight(ctx) {
    const { x, z, index, waterInfluence } = ctx;

    // Very gentle undulation — a fraction of rollingHills' amplitude.
    let height = Math.sin(x * 0.07 + 1.3) * 0.08 + Math.cos(z * 0.08 - 0.7) * 0.07;
    height += seededRange(index * 0.7, -1, 1) * 0.02;

    if (waterInfluence > 0) {
      const basinHeight = -0.5;
      const t = Math.min(1, waterInfluence * 1.4);
      height = height * (1 - t) + basinHeight * t;
    }

    return height;
  },

  computeColor(ctx, _height, palette, _params) {
    const { waterInfluence, developmentLevel } = ctx;

    const grassLush = new THREE.Color(palette.primary);
    const grassDry = new THREE.Color(palette.secondary);
    const shoreline = new THREE.Color(palette.shoreline ?? palette.secondary);
    const developed = new THREE.Color(palette.developed);

    let color: THREE.Color;
    if (waterInfluence > 0.4) {
      color = shoreline.clone().lerp(grassLush, Math.max(0, 1 - waterInfluence));
    } else {
      color = grassLush.clone().lerp(grassDry, 0.3);
    }
    color = color.lerp(developed, developmentLevel * 0.5);

    return color;
  },
};
