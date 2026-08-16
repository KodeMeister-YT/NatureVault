import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface VineProps {
  position: [number, number, number];
  scale?: number;
  count?: number;
  vegetationDensity?: number; // 0-1
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * An instanced cluster of thin, drooping vine strands hanging from a shared
 * attachment point near the top of a host canopy tree — following Fern.tsx's
 * outward-angled instancing approach, but tilted downward/draping rather than
 * spreading outward, to read as hanging vegetation rather than a ground fern.
 * Deep green with a slightly bluer hue than Fern's shaded green, so the two
 * primitives stay visually distinguishable.
 */
export function Vine({
  position,
  scale = 1,
  count = 18,
  vegetationDensity = 1,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: VineProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const visibleCount = Math.max(4, Math.round(count * vegetationDensity));

  const transforms = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = seededRange(i * 3.7 + position[0], 0, Math.PI * 2);
      const attachRadius = seededRange(i * 5.3 + position[2], 0, 0.35);
      const x = Math.cos(angle) * attachRadius;
      const z = Math.sin(angle) * attachRadius;
      const strandLength = seededRange(i * 2.9, 0.9, 1.8);
      // Vines hang nearly straight down with only a slight outward lean.
      const droopTilt = seededRange(i * 4.1, 0.05, 0.22);
      const swaySeed = seededRange(i * 8.8, 0, Math.PI * 2);
      return { x, z, angle, strandLength, droopTilt, swaySeed };
    });
  }, [count, position]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { x, z, angle, strandLength, droopTilt, swaySeed } = transforms[i];
      const visible = i < visibleCount;
      const sway = Math.sin(t * 0.5 + swaySeed) * 0.03;

      // Anchor near the top and hang the strand downward from that point.
      dummy.position.set(x, visible ? -strandLength * 0.5 : -2, z);
      dummy.rotation.set(droopTilt + sway, -angle, 0);
      dummy.scale.set(visible ? 1 : 0.001, visible ? strandLength : 0.001, visible ? 1 : 0.001);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
        {/* Thin, elongated cylinder reads as a hanging vine strand. */}
        <cylinderGeometry args={[0.02, 0.03, 1, 5]} />
        <meshStandardMaterial
          color={selected ? '#7fbf8a' : '#1f4a3a'}
          roughness={0.85}
          transparent
          opacity={dimmed ? 0.2 : 1}
        />
      </instancedMesh>
      {/* invisible larger hit-area so the cluster is easy to click */}
      <mesh position={[0, -0.8, 0]} visible={false}>
        <sphereGeometry args={[0.5, 8, 8]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
