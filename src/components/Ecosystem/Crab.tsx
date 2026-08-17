import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface CrabProps {
  position: [number, number, number];
  /** Biome-specific base (unselected) color, resolved via resolveBiomeStyle. Ignored when selected. */
  colorOverride?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A small crab that idles at the water's edge with an occasional sideways
 * scuttle. Follows Frog.tsx's idle/animation structure (a small squashed
 * body + a periodic Math.sin-driven movement offset), but scaled up and
 * widened, with two small claw meshes, and the offset applied to X
 * (sideways scuttle) instead of Y (vertical hop).
 */
export function Crab({ position, colorOverride, selected, dimmed, onClick, onPointerOver, onPointerOut }: CrabProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const scuttle = Math.sin(t * 1.1) ** 6 * Math.sign(Math.sin(t * 1.1)) * 0.14;
    groupRef.current.position.x = position[0] + scuttle;
  });

  const color = selected ? '#e8896a' : colorOverride ?? '#c1502f';
  const opacity = dimmed ? 0.25 : 1;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* flattened, widened body */}
      <mesh position={[0, 0.08, 0]} scale={[1.3, 0.55, 1]} castShadow>
        <sphereGeometry args={[0.14, 10, 8]} />
        <meshStandardMaterial color={color} roughness={0.75} transparent opacity={opacity} />
      </mesh>
      {/* eyes */}
      {[-0.06, 0.06].map((x) => (
        <mesh key={x} position={[x, 0.16, 0.11]}>
          <sphereGeometry args={[0.02, 6, 6]} />
          <meshStandardMaterial color="#1a1210" transparent opacity={opacity} />
        </mesh>
      ))}
      {/* claws */}
      <mesh position={[-0.22, 0.09, 0.1]} rotation={[0, 0.4, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.22, 0.09, 0.1]} rotation={[0, -0.4, 0]} castShadow>
        <sphereGeometry args={[0.06, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      {/* legs */}
      {[-0.16, -0.08, 0.08, 0.16].map((x, i) => (
        <mesh key={x} position={[x, 0.04, -0.13]} rotation={[0, 0, i % 2 === 0 ? 0.3 : -0.3]}>
          <cylinderGeometry args={[0.012, 0.012, 0.14, 5]} />
          <meshStandardMaterial color={color} roughness={0.8} transparent opacity={opacity} />
        </mesh>
      ))}
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.24, 0.29, 20]} />
          <meshBasicMaterial color="#d8b872" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
