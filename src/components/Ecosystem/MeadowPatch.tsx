import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface MeadowPatchProps {
  position: [number, number, number];
  radius?: number;
  count?: number;
  vegetationDensity: number; // 0-1
  color?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** A cluster of instanced grass blades that sway gently in the wind. */
export function MeadowPatch({
  position,
  radius = 2,
  count = 60,
  vegetationDensity,
  color = '#8fae5c',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: MeadowPatchProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const visibleCount = Math.max(6, Math.round(count * vegetationDensity));

  const transforms = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = seededRange(i * 3.1 + position[0], 0, Math.PI * 2);
      const r = seededRange(i * 5.7 + position[2], 0, radius);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const h = seededRange(i * 2.3, 0.3, 0.6);
      const swaySeed = seededRange(i * 7.9, 0, Math.PI * 2);
      return { x, z, h, swaySeed };
    });
  }, [count, radius, position]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { x, z, h, swaySeed } = transforms[i];
      const visible = i < visibleCount;
      dummy.position.set(position[0] + x, visible ? h / 2 : -2, position[2] + z);
      dummy.rotation.set(0, 0, Math.sin(t * 1.4 + swaySeed) * 0.25);
      dummy.scale.set(1, visible ? h : 0.001, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <coneGeometry args={[0.06, 1, 4]} />
        <meshStandardMaterial
          color={selected ? '#c7e0a0' : color}
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
