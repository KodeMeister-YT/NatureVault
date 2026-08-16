import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface AnimalProps {
  position: [number, number, number];
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** A simple low-poly quadruped (deer / goat style stand-in). */
export function Animal({ position, selected, dimmed, onClick, onPointerOver, onPointerOut }: AnimalProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (groupRef.current) {
      groupRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 1.5) * 0.02;
    }
  });

  const color = selected ? '#c69a5f' : '#6b4f36';
  const opacity = dimmed ? 0.25 : 1;

  return (
    <group ref={groupRef} position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* body */}
      <mesh position={[0, 0.35, 0]} castShadow>
        <boxGeometry args={[0.7, 0.35, 0.3]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={opacity} />
      </mesh>
      {/* neck + head */}
      <mesh position={[0.4, 0.55, 0]} rotation={[0, 0, 0.5]} castShadow>
        <boxGeometry args={[0.15, 0.35, 0.2]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.55, 0.72, 0]} castShadow>
        <boxGeometry args={[0.22, 0.16, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.9} transparent opacity={opacity} />
      </mesh>
      {/* legs */}
      {[
        [-0.25, 0, 0.1],
        [-0.25, 0, -0.1],
        [0.25, 0, 0.1],
        [0.25, 0, -0.1],
      ].map((p, i) => (
        <mesh key={i} position={[p[0], 0.12, p[2]]} castShadow>
          <boxGeometry args={[0.08, 0.35, 0.08]} />
          <meshStandardMaterial color={color} roughness={0.9} transparent opacity={opacity} />
        </mesh>
      ))}
      {(selected) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.5, 0.6, 24]} />
          <meshBasicMaterial color="#d8b872" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
