import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface FrogProps {
  position: [number, number, number];
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** A small frog that idles with an occasional hop, sitting at the water's edge. */
export function Frog({ position, selected, dimmed, onClick, onPointerOver, onPointerOut }: FrogProps) {
  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const t = state.clock.elapsedTime;
    const hop = Math.max(0, Math.sin(t * 1.3)) ** 6 * 0.18;
    groupRef.current.position.y = position[1] + hop;
  });

  const color = selected ? '#8fd18a' : '#4a7a3f';
  const opacity = dimmed ? 0.25 : 1;

  return (
    <group
      ref={groupRef}
      position={position}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <mesh position={[0, 0.07, 0]} scale={[1, 0.7, 1.2]} castShadow>
        <sphereGeometry args={[0.1, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 0.13, 0.08]} scale={[0.85, 0.6, 0.85]}>
        <sphereGeometry args={[0.07, 8, 8]} />
        <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
      </mesh>
      {[-0.05, 0.05].map((x) => (
        <mesh key={x} position={[x, 0.19, 0.11]}>
          <sphereGeometry args={[0.025, 6, 6]} />
          <meshStandardMaterial color="#1a2a17" transparent opacity={opacity} />
        </mesh>
      ))}
      {(selected) && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.16, 0.2, 20]} />
          <meshBasicMaterial color="#d8b872" side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
