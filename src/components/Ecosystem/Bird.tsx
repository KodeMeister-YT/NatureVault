import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface BirdProps {
  center: [number, number, number];
  radius?: number;
  speed?: number;
  height?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** A small bird that circles a fixed point, with a simple flapping wing animation. */
export function Bird({
  center,
  radius = 3,
  speed = 0.4,
  height = 4,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: BirdProps) {
  const groupRef = useRef<THREE.Group>(null);
  const wingLeftRef = useRef<THREE.Mesh>(null);
  const wingRightRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.elapsedTime * speed;
    if (groupRef.current) {
      const x = center[0] + Math.cos(t) * radius;
      const z = center[2] + Math.sin(t) * radius;
      const y = height + Math.sin(t * 2) * 0.3;
      groupRef.current.position.set(x, y, z);
      groupRef.current.rotation.y = -t + Math.PI / 2;
    }
    const flap = Math.sin(state.clock.elapsedTime * 10) * 0.6;
    if (wingLeftRef.current) wingLeftRef.current.rotation.z = flap;
    if (wingRightRef.current) wingRightRef.current.rotation.z = -flap;
  });

  const color = selected ? '#d8b872' : '#2b2b2b';
  const opacity = dimmed ? 0.2 : 1;

  return (
    <group ref={groupRef} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <mesh>
        <coneGeometry args={[0.08, 0.3, 4]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh ref={wingLeftRef} position={[0.1, 0, 0]}>
        <boxGeometry args={[0.28, 0.02, 0.1]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      <mesh ref={wingRightRef} position={[-0.1, 0, 0]}>
        <boxGeometry args={[0.28, 0.02, 0.1]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
