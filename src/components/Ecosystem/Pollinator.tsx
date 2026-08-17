import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface PollinatorProps {
  center: [number, number, number];
  /** Biome-specific base (unselected) color, resolved via resolveBiomeStyle. Ignored when selected. */
  colorOverride?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** A small bee-like creature that hovers erratically near a flower patch. */
export function Pollinator({ center, colorOverride, selected, dimmed, onClick, onPointerOver, onPointerOut }: PollinatorProps) {
  const ref = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime * 2;
    ref.current.position.set(
      center[0] + Math.sin(t) * 0.6,
      center[1] + 0.5 + Math.sin(t * 3) * 0.15,
      center[2] + Math.cos(t * 1.3) * 0.6,
    );
  });

  return (
    <mesh ref={ref} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      <sphereGeometry args={[0.06, 8, 8]} />
      <meshStandardMaterial
        color={selected ? '#ffd76a' : colorOverride ?? '#e0a83c'}
        emissive={selected ? '#ffd76a' : '#000000'}
        emissiveIntensity={selected ? 0.5 : 0}
        transparent
        opacity={dimmed ? 0.2 : 1}
      />
    </mesh>
  );
}
