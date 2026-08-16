import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface TreeProps {
  position: [number, number, number];
  scale?: number;
  seed?: number;
  /** 'conifer' (default, existing stacked-cone stylized fir/cedar) or 'broadleaf'
   *  (wider, flatter canopy silhouette used for the tropical-forest canopyTree kind). */
  variant?: 'conifer' | 'broadleaf';
  selected?: boolean;
  dimmed?: boolean;
  highlighted?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export function Tree({
  position,
  scale = 1,
  seed = 0,
  variant = 'conifer',
  selected,
  dimmed,
  highlighted,
  onClick,
  onPointerOver,
  onPointerOut,
}: TreeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const swayOffset = seed % (Math.PI * 2);

  useFrame((state) => {
    if (groupRef.current) {
      const t = state.clock.elapsedTime;
      groupRef.current.rotation.z = Math.sin(t * 0.6 + swayOffset) * 0.02;
      groupRef.current.rotation.x = Math.cos(t * 0.5 + swayOffset) * 0.015;
    }
  });

  const foliageColor = highlighted ? '#8fd18a' : selected ? '#a8d99a' : '#2f5a3a';
  const opacity = dimmed ? 0.25 : 1;

  return (
    <group
      ref={groupRef}
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* trunk — slightly thicker for a broadleaf canopy tree */}
      <mesh position={[0, variant === 'broadleaf' ? 0.7 : 0.6, 0]} castShadow>
        <cylinderGeometry args={variant === 'broadleaf' ? [0.16, 0.24, 1.4, 6] : [0.12, 0.18, 1.2, 6]} />
        <meshStandardMaterial color="#4a3524" roughness={0.9} transparent opacity={opacity} />
      </mesh>
      {variant === 'broadleaf' ? (
        // foliage — a couple of wide, flattened overlapping domes for a canopy-tree
        // silhouette (wider than tall), rather than the tall stacked conifer cones.
        <>
          <mesh position={[0, 1.75, 0]} scale={[1.9, 0.85, 1.9]} castShadow>
            <sphereGeometry args={[0.85, 10, 8]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.35, 1.55, 0.2]} scale={[1.3, 0.7, 1.3]} castShadow>
            <sphereGeometry args={[0.6, 8, 6]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} transparent opacity={opacity} />
          </mesh>
        </>
      ) : (
        // foliage — layered cones for a stylized conifer
        <>
          <mesh position={[0, 1.6, 0]} castShadow>
            <coneGeometry args={[0.9, 1.4, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, 2.3, 0]} castShadow>
            <coneGeometry args={[0.7, 1.2, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, 2.9, 0]} castShadow>
            <coneGeometry args={[0.45, 1, 7]} />
            <meshStandardMaterial color={foliageColor} roughness={0.8} transparent opacity={opacity} />
          </mesh>
        </>
      )}
      {(selected || highlighted) && (
        <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.9, 1.05, 32]} />
          <meshBasicMaterial color={selected ? '#d8b872' : '#8fd18a'} side={THREE.DoubleSide} />
        </mesh>
      )}
    </group>
  );
}
