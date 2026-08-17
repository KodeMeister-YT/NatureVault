import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface AnemoneProps {
  position: [number, number, number];
  radius?: number;
  count?: number;
  /** Biome-specific base (unselected) color, resolved via resolveBiomeStyle. Ignored when selected. */
  colorOverride?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A sea anemone built from instanced, thin cone "tentacles" scattered around
 * a base point, following the same instancing pattern as Coral. Tentacles
 * are shorter and thinner than Coral's branches, and sway faster/more
 * erratically so they read as soft, waving tentacles rather than rigid
 * coral branches.
 */
export function Anemone({
  position,
  radius = 0.35,
  count = 14,
  colorOverride,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: AnemoneProps) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  const transforms = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const angle = seededRange(i * 4.1 + position[0], 0, Math.PI * 2);
      const r = seededRange(i * 6.3 + position[2], 0, radius * 0.5);
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r;
      const h = seededRange(i * 2.7, 0.12, 0.26);
      const tiltAxis = angle;
      const swaySeed = seededRange(i * 9.4, 0, Math.PI * 2);
      const swaySpeed = seededRange(i * 11.2, 1.6, 2.6);
      return { x, z, h, tiltAxis, swaySeed, swaySpeed };
    });
  }, [count, radius, position]);

  useFrame((state) => {
    const mesh = meshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      const { x, z, h, tiltAxis, swaySeed, swaySpeed } = transforms[i];
      // faster, more erratic sway than Coral's slow current-driven tilt
      const sway = Math.sin(t * swaySpeed + swaySeed) * 0.35 + Math.sin(t * swaySpeed * 1.7 + swaySeed) * 0.15;
      dummy.position.set(position[0] + x, position[1] + h / 2, position[2] + z);
      dummy.rotation.set(Math.cos(tiltAxis) * sway, tiltAxis, Math.sin(tiltAxis) * sway);
      dummy.scale.set(1, h, 1);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  const baseColor = colorOverride ?? '#c15fae';
  const finalColor = selected ? '#ff9ae0' : baseColor;
  const opacity = dimmed ? 0.2 : 1;

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* base disc the tentacles sprout from */}
      <mesh position={[position[0], position[1] + 0.02, position[2]]} castShadow>
        <cylinderGeometry args={[radius * 0.55, radius * 0.6, 0.06, 12]} />
        <meshStandardMaterial color={finalColor} roughness={0.6} transparent opacity={opacity} />
      </mesh>
      <instancedMesh ref={meshRef} args={[undefined, undefined, count]} castShadow>
        <coneGeometry args={[0.025, 1, 6]} />
        <meshStandardMaterial color={finalColor} roughness={0.5} transparent opacity={opacity} />
      </instancedMesh>
      {/* invisible larger hit-area so the cluster is easy to click */}
      <mesh position={position} rotation={[-Math.PI / 2, 0, 0]} visible={false}>
        <circleGeometry args={[radius, 12]} />
        <meshBasicMaterial transparent opacity={0} />
      </mesh>
    </group>
  );
}
