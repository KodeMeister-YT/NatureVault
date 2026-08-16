import * as THREE from 'three';
import { seededRange } from '../../../utils/seededRandom';
import type { TerrainStrategy } from './types';

const DEFAULT_CLIFF_FACES = 4;
const DEFAULT_ELEVATION_SCALE = 2.4;
const ROCK_FACE_THRESHOLD = 1.6;

/**
 * Base elevation offset plus sharper, higher-amplitude ridges than rollingHills,
 * with a distinct rock-face color band above ROCK_FACE_THRESHOLD — used for the
 * Alpine biome's walkable ground so it reads as real elevation rather than a flat
 * plane with a background Mountain prop.
 */
export const elevatedCliffs: TerrainStrategy = {
  computeHeight(ctx, params) {
    const { x, z, index, waterInfluence } = ctx;
    const cliffFaces = params?.cliffFaces ?? DEFAULT_CLIFF_FACES;
    const elevationScale = params?.elevationScale ?? DEFAULT_ELEVATION_SCALE;

    // Base elevation offset, always lifting the terrain up.
    const baseElevation = 0.9 * elevationScale;

    // Sharper ridges via a higher-frequency, higher-amplitude term combined with
    // an angular-faceted component (abs of sine) that reads as distinct rock faces.
    const ridge = Math.abs(Math.sin(x * 0.12 * cliffFaces + z * 0.09)) * 1.2 * elevationScale;
    const undulation = Math.sin(x * 0.08 + 1.3) * 0.35 * elevationScale + Math.cos(z * 0.1 - 0.7) * 0.3 * elevationScale;

    let height = baseElevation + ridge + undulation;
    height += seededRange(index * 0.7, -1, 1) * 0.15 * elevationScale;

    if (waterInfluence > 0) {
      const basinHeight = -0.5;
      const t = Math.min(1, waterInfluence * 1.4);
      height = height * (1 - t) + basinHeight * t;
    }

    return height;
  },

  computeColor(ctx, height, palette, _params) {
    const { developmentLevel } = ctx;

    const meadow = new THREE.Color(palette.primary);
    const rockLow = new THREE.Color(palette.secondary);
    const rockFace = new THREE.Color('#7a7568');
    const developed = new THREE.Color(palette.developed);

    let color: THREE.Color;
    if (height > ROCK_FACE_THRESHOLD) {
      const t = Math.min(1, (height - ROCK_FACE_THRESHOLD) / 1.5);
      color = rockLow.clone().lerp(rockFace, t);
    } else {
      color = meadow.clone().lerp(rockLow, Math.max(0, height / ROCK_FACE_THRESHOLD));
    }
    color = color.lerp(developed, developmentLevel * 0.5);

    return color;
  },
};
