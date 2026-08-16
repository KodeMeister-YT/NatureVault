import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface MossPatchProps {
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
 * A low carpet of moss — instanced small hemisphere domes hugging the ground,
 * rather than blade geometry. Soft yellow-green, distinguishable from
 * MeadowPatch's grass green, ReedCluster's marsh green, and Fern's deep
 * shaded green. Mostly still (moss doesn't sway), with only a very subtle
 * breathing scale to avoid looking completely static/lifeless.
 */
export function MossPatch({
  position,
  radius = 0.9,
  count = 50,
  vegetationDensity = 1,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: MossPatchProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const visibleCount = Math.max(8, Math.round(count * vegetationDensity));

  const transforms = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = seededRange(i * 4.6 + position[0], 0, Math.PI * 2);
      const r = seededRange(i * 6.7 + position[2], 0, radius);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const domeSize = seededRange(i * 1.7, 0.08, 0.16);
      const breatheSeed = seededRange(i * 9.3, 0, Math.PI * 2);
      return { x, z, domeSize, breatheSeed };
    });
  }, [count, radius, position]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { x, z, domeSize, breatheSeed } = transforms[i];
      const visible = i < visibleCount;
      const breathe = 1 + Math.sin(t * 0.5 + breatheSeed) * 0.03;

      dummy.position.set(position[0] + x, visible ? domeSize * 0.5 : -2, position[2] + z);
      dummy.rotation.set(0, 0, 0);
      dummy.scale.setScalar(visible ? domeSize * breathe : 0.001);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[1, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial
          color={selected ? '#d9dd8c' : '#9cae5a'}
          roughness={0.95}
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
