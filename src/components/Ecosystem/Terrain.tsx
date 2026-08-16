import { useMemo } from 'react';
import * as THREE from 'three';
import type { TerrainConfig } from '../../types/biome';
import { terrainStrategies } from './terrainStrategies';
import type { TerrainVertexContext } from './terrainStrategies';

export interface WaterBody {
  position: [number, number, number];
  /** Influence radius for shoreline carving; derived from the object's featureRadius. */
  featureRadius: number;
}

interface TerrainProps {
  config: TerrainConfig;
  developmentLevel: number; // 0-1
  waterLevel: number; // 0-1, used to soften mud/shore zones near water
  /** Real water body positions/radii from the vault, so the shoreline dip lines up with visible water meshes. */
  waterBodies?: WaterBody[];
}

const SIZE = 70;
const SEGMENTS = 90;

/**
 * Ground plane with procedural elevation and per-vertex coloring. The actual
 * height/color math is delegated to a TerrainStrategy looked up from
 * `terrainStrategies[config.kind]`, so each biome's terrain can have a
 * genuinely different shape (flat, duned, cliffed, underwater) while this
 * component keeps a single PlaneGeometry + vertex loop.
 */
export function Terrain({ config, developmentLevel, waterLevel, waterBodies = [] }: TerrainProps) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    const pos = geo.attributes.position;
    const colors: number[] = [];
    const strategy = terrainStrategies[config.kind];

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const z = pos.getY(i); // plane is unrotated here; this becomes world Z after rotation

      // Shoreline-carving influence, derived from each water body's featureRadius.
      let maxShoreInfluence = 0;
      for (const body of waterBodies) {
        const [wx, , wz] = body.position;
        const dist = Math.sqrt((x - wx) ** 2 + (z - wz) ** 2);
        const influence = Math.max(0, 1 - dist / (body.featureRadius + 3));
        if (influence > maxShoreInfluence) maxShoreInfluence = influence;
      }

      const ctx: TerrainVertexContext = {
        x,
        z,
        index: i,
        waterInfluence: maxShoreInfluence,
        developmentLevel,
      };

      const height = strategy.computeHeight(ctx, config.params);
      pos.setZ(i, height);

      const color = strategy.computeColor(ctx, height, config.palette, config.params);
      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config, waterLevel, developmentLevel, JSON.stringify(waterBodies)]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
    </mesh>
  );
}
