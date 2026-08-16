import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface ReedClusterProps {
  position: [number, number, number];
  radius?: number;
  count?: number;
  vegetationDensity: number; // 0-1
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A dense cluster of tall, thin reed blades — meant to line a shoreline.
 * Two instanced meshes (blade + a small seed-head) give it more visual
 * richness than a single flat-colored cone patch.
 */
export function ReedCluster({
  position,
  radius = 2.2,
  count = 90,
  vegetationDensity,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: ReedClusterProps) {
  const bladeRef = useRef<THREE.InstancedMesh>(null);
  const headRef = useRef<THREE.InstancedMesh>(null);
  const visibleCount = Math.max(8, Math.round(count * vegetationDensity));

  const transforms = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = seededRange(i * 4.1 + position[0], 0, Math.PI * 2);
      const r = seededRange(i * 6.3 + position[2], 0, radius);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const h = seededRange(i * 1.9, 0.9, 1.7);
      const tilt = seededRange(i * 3.4, -0.08, 0.08);
      const swaySeed = seededRange(i * 8.6, 0, Math.PI * 2);
      const hue = seededRange(i * 2.7, 0, 1);
      return { x, z, h, tilt, swaySeed, hue };
    });
  }, [count, radius, position]);

  const opacity = dimmed ? 0.2 : 1;
  const baseColor = selected ? '#c7d98a' : '#6f8f4a';
  const headColor = selected ? '#e0c96f' : '#a68a4a';

  useFrame((state) => {
    const bladeMesh = bladeRef.current;
    const headMesh = headRef.current;
    if (!bladeMesh || !headMesh) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { x, z, h, tilt, swaySeed } = transforms[i];
      const visible = i < visibleCount;
      const sway = Math.sin(t * 1.1 + swaySeed) * 0.18;

      dummy.position.set(position[0] + x, visible ? h / 2 : -2, position[2] + z);
      dummy.rotation.set(tilt, 0, sway);
      dummy.scale.set(1, visible ? h : 0.001, 1);
      dummy.updateMatrix();
      bladeMesh.setMatrixAt(i, dummy.matrix);

      dummy.position.set(position[0] + x, visible ? h + 0.05 : -2, position[2] + z);
      dummy.rotation.set(tilt, 0, sway);
      dummy.scale.set(visible ? 1 : 0.001, visible ? 1 : 0.001, visible ? 1 : 0.001);
      dummy.updateMatrix();
      headMesh.setMatrixAt(i, dummy.matrix);
    }
    bladeMesh.instanceMatrix.needsUpdate = true;
    headMesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <instancedMesh ref={bladeRef} args={[undefined, undefined, count]} castShadow>
        <coneGeometry args={[0.035, 1, 4]} />
        <meshStandardMaterial color={baseColor} roughness={0.85} transparent opacity={opacity} />
      </instancedMesh>
      <instancedMesh ref={headRef} args={[undefined, undefined, count]}>
        <sphereGeometry args={[0.05, 5, 5]} />
        <meshStandardMaterial color={headColor} roughness={0.8} transparent opacity={opacity} />
      </instancedMesh>
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[radius, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
