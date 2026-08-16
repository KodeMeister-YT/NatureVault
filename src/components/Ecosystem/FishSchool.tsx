import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface FishSchoolProps {
  center: [number, number, number];
  radius?: number;
  speed?: number;
  count?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A loose group of small fish that drift together, modeled after Bird's
 * circling useFrame pattern but horizontal and grouped: each instance
 * orbits a shared slowly-circling center with its own offset and a small
 * individual wobble so the school doesn't move as one rigid block.
 */
export function FishSchool({
  center,
  radius = 1.4,
  speed = 0.3,
  count = 7,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: FishSchoolProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const fish = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const offsetAngle = seededRange(i * 3.3 + center[0], 0, Math.PI * 2);
      const offsetRadius = seededRange(i * 5.1 + center[2], 0, radius * 0.6);
      const bobHeight = seededRange(i * 2.4, -0.15, 0.15);
      const wobbleSeed = seededRange(i * 6.7, 0, Math.PI * 2);
      const wobbleSpeed = seededRange(i * 1.8, 1.4, 2.4);
      return { offsetAngle, offsetRadius, bobHeight, wobbleSeed, wobbleSpeed };
    });
  }, [count, radius, center]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime * speed;
    const centerX = center[0] + Math.cos(t) * radius;
    const centerZ = center[2] + Math.sin(t) * radius;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { offsetAngle, offsetRadius, bobHeight, wobbleSeed, wobbleSpeed } = fish[i];
      const wobbleT = state.clock.elapsedTime * wobbleSpeed + wobbleSeed;
      const x = centerX + Math.cos(t + offsetAngle) * offsetRadius + Math.sin(wobbleT) * 0.08;
      const z = centerZ + Math.sin(t + offsetAngle) * offsetRadius + Math.cos(wobbleT) * 0.08;
      const y = center[1] + bobHeight + Math.sin(wobbleT * 1.3) * 0.05;
      dummy.position.set(x, y, z);
      dummy.rotation.y = -(t + offsetAngle) + Math.PI / 2;
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const color = selected ? '#8fd0e0' : '#4a90a8';
  const opacity = dimmed ? 0.2 : 1;

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        <coneGeometry args={[0.05, 0.22, 4]} />
        <meshStandardMaterial color={color} roughness={0.5} transparent opacity={opacity} />
      </instancedMesh>
    </group>
  );
}
