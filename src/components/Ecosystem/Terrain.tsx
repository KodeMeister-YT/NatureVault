import { useMemo } from 'react';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';

export interface WaterBody {
  position: [number, number, number];
  radius: number;
}

interface TerrainProps {
  developmentLevel: number; // 0-1
  waterLevel: number; // 0-1, used to soften mud/shore zones near water
  /** Real water body positions/radii from the vault, so the shoreline dip lines up with visible water meshes. */
  waterBodies?: WaterBody[];
}

const SIZE = 70;
const SEGMENTS = 90;

/**
 * Ground plane with gentle procedural elevation (low hills, shoreline dips carved
 * around every real water body) and per-vertex coloring so the terrain reads as
 * grass / mud / sandy shore rather than a single flat-colored plane. Colors shift
 * toward a more muted, developed tone as developmentLevel increases.
 */
export function Terrain({ developmentLevel, waterLevel, waterBodies = [] }: TerrainProps) {
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(SIZE, SIZE, SEGMENTS, SEGMENTS);
    const pos = geo.attributes.position;
    const colors: number[] = [];

    const grassLush = new THREE.Color('#3d5a34');
    const grassDry = new THREE.Color('#6b6a45');
    const mud = new THREE.Color('#5a4a34');
    const sand = new THREE.Color('#a89468');
    const developed = new THREE.Color('#54524a');

    for (let i = 0; i < pos.count; i++) {
      const x = pos.getX(i);
      const y = pos.getY(i); // plane is unrotated here; this becomes world Z after rotation

      // Gentle rolling elevation via layered sine noise, seeded so it's stable.
      let height =
        Math.sin(x * 0.09 + 1.3) * 0.5 +
        Math.cos(y * 0.11 - 0.7) * 0.45 +
        Math.sin((x + y) * 0.05) * 0.35;

      // Small random jitter per-vertex for a less mathematically perfect look.
      height += seededRange(i * 0.7, -1, 1) * 0.08;

      // Carve a basin around every real water body so the terrain never buries the
      // water mesh. Water sits at a fixed world height just below y=0, so blend
      // (rather than merely subtract) toward a basin height that is guaranteed to
      // sit below the water surface near the shoreline — rolling noise alone could
      // otherwise push terrain above the water plane and hide it entirely.
      let maxShoreInfluence = 0;
      for (const body of waterBodies) {
        const [wx, , wz] = body.position;
        const dist = Math.sqrt((x - wx) ** 2 + (y - wz) ** 2);
        const influence = Math.max(0, 1 - dist / (body.radius + 3));
        if (influence > maxShoreInfluence) maxShoreInfluence = influence;
      }
      if (maxShoreInfluence > 0) {
        const basinHeight = -0.35 - waterLevel * 0.4;
        const t = Math.min(1, maxShoreInfluence * 1.4);
        height = height * (1 - t) + basinHeight * t;
      }

      pos.setZ(i, height);

      // Color zone based on height + distance to shoreline.
      let color: THREE.Color;
      if (maxShoreInfluence > 0.55) {
        color = mud.clone().lerp(sand, Math.min(1, maxShoreInfluence - 0.55) * 2);
      } else if (maxShoreInfluence > 0.25) {
        color = mud.clone().lerp(grassLush, 0.35);
      } else if (height > 1.1) {
        color = grassDry.clone();
      } else {
        color = grassLush.clone().lerp(grassDry, Math.max(0, (height + 0.3) / 2));
      }
      color = color.lerp(developed, developmentLevel * 0.5);

      colors.push(color.r, color.g, color.b);
    }

    geo.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));
    geo.computeVertexNormals();
    return geo;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [waterLevel, developmentLevel, JSON.stringify(waterBodies)]);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow geometry={geometry}>
      <meshStandardMaterial vertexColors roughness={0.95} metalness={0} />
    </mesh>
  );
}
