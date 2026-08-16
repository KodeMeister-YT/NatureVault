import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface FernProps {
  position: [number, number, number];
  radius?: number;
  count?: number;
  vegetationDensity?: number; // 0-1
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A low, spreading cluster of fern fronds — instanced flattened cones angled
 * outward from a shared base, reading as a forest-floor understory clump
 * rather than upright grass blades (MeadowPatch) or tall shoreline reeds
 * (ReedCluster). Deep shaded green, distinct from both.
 */
export function Fern({
  position,
  radius = 1.1,
  count = 40,
  vegetationDensity = 1,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: FernProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const visibleCount = Math.max(6, Math.round(count * vegetationDensity));

  const transforms = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = seededRange(i * 3.9 + position[0], 0, Math.PI * 2);
      const r = seededRange(i * 5.1 + position[2], 0, radius);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const frondLength = seededRange(i * 2.1, 0.35, 0.62);
      // Fronds arc outward from center and droop slightly — angled, not upright.
      const outwardTilt = seededRange(i * 4.4, 0.55, 0.95);
      const swaySeed = seededRange(i * 8.2, 0, Math.PI * 2);
      return { x, z, angle, frondLength, outwardTilt, swaySeed };
    });
  }, [count, radius, position]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { x, z, angle, frondLength, outwardTilt, swaySeed } = transforms[i];
      const visible = i < visibleCount;
      const sway = Math.sin(t * 0.9 + swaySeed) * 0.06;

      dummy.position.set(position[0] + x, visible ? frondLength * 0.35 : -2, position[2] + z);
      // Point each frond outward and downward from the cluster center, with a gentle sway.
      dummy.rotation.set(outwardTilt + sway, -angle, 0);
      dummy.scale.set(visible ? 1 : 0.001, visible ? frondLength : 0.001, visible ? 1 : 0.001);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        {/* Flattened, elongated cone reads as a narrow tapering frond. */}
        <coneGeometry args={[0.05, 1, 4]} />
        <meshStandardMaterial
          color={selected ? '#7fae6a' : '#284a2c'}
          roughness={0.9}
          transparent
          opacity={dimmed ? 0.2 : 1}
        />
      </instancedMesh>
      {/* invisible larger hit-area so the patch is easy to click */}
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[radius, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
