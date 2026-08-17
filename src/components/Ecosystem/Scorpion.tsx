import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface ScorpionProps {
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
 * A small scorpion: a segmented body, a pair of pincer claws out front, four
 * short legs, and a curled tail arched over its back ending in a raised
 * stinger. Follows Crab.tsx's low-poly small-creature pattern (a subtle,
 * periodic Math.sin-driven idle scuttle applied to X), but elongated and
 * scaled down rather than widened, since a scorpion reads as a longer,
 * narrower silhouette than a crab.
 */
export function Scorpion({ position, colorOverride, selected, dimmed, onClick, onPointerOver, onPointerOut }: ScorpionProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const scuttle = Math.sin(t * 0.7) ** 6 * Math.sign(Math.sin(t * 0.7)) * 0.08;
    groupRef.current.position.x = position[0] + scuttle;
  });

  const color = selected ? '#caa15a' : colorOverride ?? '#5a4430';
  const opacity = dimmed ? 0.25 : 1;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* segmented body: cephalothorax + tapering abdomen */}
      <mesh position={[0, 0.05, 0.1]} scale={[0.6, 0.5, 0.8]} castShadow>
        <sphereGeometry args={[0.11, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.045, -0.05]} scale={[0.55, 0.4, 0.6]} castShadow>
        <sphereGeometry args={[0.09, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      {/* pincers */}
      {[-1, 1].map((side) => (
        <group key={side} position={[side * 0.13, 0.05, 0.2]} rotation={[0, side * 0.3, 0]}>
          <mesh position={[0, 0, 0.06]} castShadow>
            <cylinderGeometry args={[0.02, 0.025, 0.14, 6]} />
            <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
          </mesh>
          <mesh position={[side * 0.03, 0, 0.14]} scale={[0.6, 0.5, 0.8]} castShadow>
            <sphereGeometry args={[0.035, 6, 6]} />
            <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
      {/* legs */}
      {[0.08, 0.02, -0.04, -0.09].map((zOff, i) => (
        <mesh key={zOff} position={[0, 0.02, zOff]} rotation={[0, 0, i % 2 === 0 ? 0.5 : -0.5]}>
          <cylinderGeometry args={[0.008, 0.008, 0.16, 5]} />
          <meshStandardMaterial color={color} roughness={0.8} transparent opacity={opacity} />
        </mesh>
      ))}
      {/* curled tail arched over the back, ending in a raised stinger */}
      <group position={[0, 0.06, -0.16]} rotation={[0.9, 0, 0]}>
        <mesh position={[0, 0, 0.05]} castShadow>
          <cylinderGeometry args={[0.018, 0.024, 0.12, 6]} />
          <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0.08, 0.14]} rotation={[-1.1, 0, 0]} castShadow>
          <cylinderGeometry args={[0.012, 0.018, 0.1, 6]} />
          <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0.13, 0.2]} castShadow>
          <coneGeometry args={[0.014, 0.05, 6]} />
          <meshStandardMaterial color={color} roughness={0.6} transparent opacity={opacity} />
        </mesh>
      </group>
      {selected && (
        <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.2, 0.24, 20]} />
          <meshBasicMaterial color="#d8b872" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
