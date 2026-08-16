import type * as THREE from 'three';
import type { TerrainConfig, TerrainPalette } from '../../../types/biome';

export interface TerrainVertexContext {
  x: number;
  z: number;
  index: number;
  /** 0-1, distance-based proximity to nearest water body (from Terrain's existing basin-carving logic). */
  waterInfluence: number;
  /** 0-1 */
  developmentLevel: number;
}

export interface TerrainStrategy {
  computeHeight(ctx: TerrainVertexContext, params: TerrainConfig['params']): number;
  computeColor(ctx: TerrainVertexContext, height: number, palette: TerrainPalette, params: TerrainConfig['params']): THREE.Color;
}
