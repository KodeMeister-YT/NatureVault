import { useMemo } from 'react';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../../types/threeEvents';
import { seededRange } from '../../../utils/seededRandom';
import { useWaterShaderMaterial } from './useWaterShaderMaterial';

interface LakeShorelineProps {
  position: [number, number, number];
  /** Average radius of the lake, in scene units — expected to be larger than a PondMarsh's. */
  radius: number;
  /** How irregular the shoreline is — defaults lower than PondMarsh for a calmer, more natural lake edge. */
  irregularity?: number;
  waterLevel: number;
  color?: string;
  shallowColor?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** Same organic-blob approach as PondMarsh, tuned for a larger, calmer body of water. */
function buildLakeShape(radius: number, irregularity: number, seed: number): THREE.Shape {
  const shape = new THREE.Shape();
  const points = 20;
  const coords: [number, number][] = [];
  for (let i = 0; i < points; i++) {
    const angle = (i / points) * Math.PI * 2;
    const noise = seededRange(seed + i * 3.3, 1 - irregularity * 0.5, 1 + irregularity * 0.5);
    const r = radius * noise;
    coords.push([Math.cos(angle) * r, Math.sin(angle) * r]);
  }
  shape.moveTo(coords[0][0], coords[0][1]);
  for (let i = 1; i <= points; i++) {
    const [cx, cy] = coords[i % points];
    const [px, py] = coords[(i - 1 + points) % points];
    const mx = (px + cx) / 2;
    const my = (py + cy) / 2;
    shape.quadraticCurveTo(px, py, mx, my);
  }
  return shape;
}

/** Larger-radius, lower-irregularity water body that reads as a real lake — handles `kind: 'lake'`. */
export function LakeShoreline({
  position,
  radius,
  irregularity = 0.18,
  waterLevel,
  color = '#2c5f78',
  shallowColor = '#6cb0c2',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: LakeShorelineProps) {
  const { materialRef, uniforms, vertexShader, fragmentShader } = useWaterShaderMaterial({
    deepColor: color,
    shallowColor,
    selected,
    dimmed,
  });

  const geometry = useMemo(() => {
    const shape = buildLakeShape(1, irregularity, position[0] * 7 + position[2] * 3);
    return new THREE.ShapeGeometry(shape, 32);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [irregularity, position]);

  const scale = radius * (0.85 + waterLevel * 0.3);

  return (
    <mesh
      position={[position[0], position[1] - 0.08, position[2]]}
      rotation={[-Math.PI / 2, 0, 0]}
      scale={[scale, scale, 1]}
      geometry={geometry}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.DoubleSide}
      />
    </mesh>
  );
}
