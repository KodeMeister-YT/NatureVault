import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface TurtleProps {
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
 * A sea turtle: follows Animal.tsx's quadruped box-body structure but
 * flattened into a wide shallow shell dome with four short flipper-boxes
 * instead of legs, with a slow up/down bob (like Animal's idle bob),
 * scaled for underwater use.
 */
export function Turtle({ position, colorOverride, selected, dimmed, onClick, onPointerOver, onPointerOut }: TurtleProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.9) * 0.05;
    }
  });

  const color = selected ? '#7fbf8a' : colorOverride ?? '#3f6b52';
  const shellColor = selected ? '#8fae5c' : '#4a7047';
  const opacity = dimmed ? 0.25 : 1;

  return (
    <group ref={groupRef} position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* wide shallow shell dome */}
      <mesh position={[0, 0.22, 0]} scale={[0.6, 0.32, 0.75]} castShadow>
        <sphereGeometry args={[0.5, 12, 10]} />
        <meshStandardMaterial color={shellColor} roughness={0.8} transparent opacity={opacity} />
      </mesh>
      {/* head */}
      <mesh position={[0, 0.16, 0.42]} scale={[0.6, 0.55, 0.7]} castShadow>
        <sphereGeometry args={[0.14, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.8} transparent opacity={opacity} />
      </mesh>
      {/* flippers instead of legs */}
      {[
        [-0.32, 0.14, 0.18, -0.3],
        [0.32, 0.14, 0.18, 0.3],
        [-0.28, 0.14, -0.26, -0.5],
        [0.28, 0.14, -0.26, 0.5],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} rotation={[0, p[3], 0]} scale={[0.9, 0.25, 0.45]} castShadow>
          <boxGeometry args={[0.24, 0.5, 0.3]} />
          <meshStandardMaterial color={color} roughness={0.8} transparent opacity={opacity} />
        </mesh>
      ))}
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.55, 0.65, 24]} />
          <meshBasicMaterial color="#d8b872" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
