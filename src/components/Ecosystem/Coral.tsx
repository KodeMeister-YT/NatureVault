import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface CoralProps {
  position: [number, number, number];
  radius?: number;
  count?: number;
  color?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A branching coral cluster built from instanced tapered cone "branches"
 * scattered around a base point, following the same instancing pattern as
 * MeadowPatch/ReedCluster. A gentle sway mimics slow underwater current.
 */
export function Coral({
  position,
  radius = 0.9,
  count = 18,
  color = '#e0765f',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: CoralProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const transforms = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = seededRange(i * 3.7 + position[0], 0, Math.PI * 2);
      const r = seededRange(i * 5.9 + position[2], 0, radius);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const h = seededRange(i * 2.1, 0.25, 0.6);
      const tilt = seededRange(i * 4.6, -0.3, 0.3);
      const tiltAxis = seededRange(i * 6.2, 0, Math.PI * 2);
      const swaySeed = seededRange(i * 8.8, 0, Math.PI * 2);
      return { x, z, h, tilt, tiltAxis, swaySeed };
    });
  }, [count, radius, position]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { x, z, h, tilt, tiltAxis, swaySeed } = transforms[i];
      const sway = Math.sin(t * 0.6 + swaySeed) * 0.06;
      dummy.position.set(position[0] + x, position[1] + h / 2, position[2] + z);
      dummy.rotation.set(Math.cos(tiltAxis) * tilt + sway, tiltAxis, Math.sin(tiltAxis) * tilt);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const finalColor = selected ? '#ffb39c' : color;
  const opacity = dimmed ? 0.2 : 1;

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
        <coneGeometry args={[0.05, 1, 6]} />
        <meshStandardMaterial color={finalColor} roughness={0.7} transparent opacity={opacity} />
      </instancedMesh>
      {/* invisible larger hit-area so the cluster is easy to click */}
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[radius, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
