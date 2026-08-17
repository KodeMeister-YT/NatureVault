import { useFrame, useThree } from '@react-three/fiber';
import type { TerrainConfig } from '../../types/biome';
import type { WaterBody } from '../Ecosystem/Terrain';
import { terrainStrategies } from '../Ecosystem/terrainStrategies';
import type { TerrainVertexContext } from '../Ecosystem/terrainStrategies';

interface CameraGroundClampProps {
  terrain: TerrainConfig;
  waterBodies: WaterBody[];
}

/** Must match Terrain.tsx's own render-loop developmentLevel usage: computeHeight for every
 *  strategy only reads waterInfluence/x/z/index from the context (developmentLevel only
 *  affects computeColor), so a fixed placeholder here is safe and keeps this component from
 *  needing the biome's live metrics just to answer "how tall is the ground here". */
const DEVELOPMENT_LEVEL_PLACEHOLDER = 0;

const MIN_CLEARANCE = 0.6;

/** Terrain.tsx's ground mesh sits at `position={[0, -0.05, 0]}`, so a local height of 0
 *  (the strategy's own "sea level") renders at world Y = -0.05, not 0. */
const TERRAIN_MESH_Y_OFFSET = -0.05;

/**
 * Safety net (not the primary fix): each frame, checks the active camera's
 * world (x, z) against the same terrain-height function Terrain.tsx uses to build
 * its geometry, and pushes the camera up if it has ended up below the floor.
 * Only ever touches `position.y`, and only via Math.max, so it never fights
 * OrbitControls' x/z/target handling — it just stops the camera from ever
 * visually clipping under the ground, for any biome, on load or while orbiting.
 *
 * IMPORTANT coordinate note: Terrain.tsx builds its PlaneGeometry unrotated (so
 * `computeHeight`'s `ctx.z` is really the plane's local Y axis), then rotates the whole
 * mesh -90 deg about X to lay it flat. That rotation maps local (x, y, height) to world
 * (x, height, -y) — i.e. world Z ends up as the *negation* of the local Y that Terrain.tsx
 * calls `ctx.z`. So sampling the terrain at a given world (worldX, worldZ) requires calling
 * `computeHeight` with `ctx.z = -worldZ`, not `worldZ` directly, or this clamp would read
 * the height from the mirrored-Z side of the terrain and misfire.
 *
 * Must be rendered after <OrbitControls> in VaultScene's JSX so this
 * component's useFrame callback runs after OrbitControls' own per-frame
 * update (R3F calls useFrame callbacks in the order their owning components
 * appear/mount, and OrbitControls registers its update in a mount effect).
 */
export function CameraGroundClamp({ terrain, waterBodies }: CameraGroundClampProps) {
  const { camera } = useThree();

  useFrame(() => {
    const strategy = terrainStrategies[terrain.kind];
    const worldX = camera.position.x;
    const worldZ = camera.position.z;

    // Local plane coordinates matching Terrain.tsx's own vertex construction.
    const localX = worldX;
    const localZ = -worldZ;

    // Match Terrain.tsx's shoreline-influence formula exactly (it compares the plane's
    // local x/z directly against each water body's world x/z), so this clamp's height
    // estimate stays consistent with the actual rendered terrain mesh.
    let maxShoreInfluence = 0;
    for (const body of waterBodies) {
      const [wx, , wz] = body.position;
      const dist = Math.sqrt((localX - wx) ** 2 + (localZ - wz) ** 2);
      const influence = Math.max(0, 1 - dist / (body.featureRadius + 3));
      if (influence > maxShoreInfluence) maxShoreInfluence = influence;
    }

    const ctx: TerrainVertexContext = {
      x: localX,
      z: localZ,
      index: 0,
      waterInfluence: maxShoreInfluence,
      developmentLevel: DEVELOPMENT_LEVEL_PLACEHOLDER,
    };

    const terrainWorldHeight = strategy.computeHeight(ctx, terrain.params) + TERRAIN_MESH_Y_OFFSET;
    const minY = terrainWorldHeight + MIN_CLEARANCE;

    if (camera.position.y < minY) {
      camera.position.y = minY;
    }
  });

  return null;
}
