import { useMemo } from 'react';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../../types/threeEvents';
import { seededRange } from '../../../utils/seededRandom';
import { useWaterShaderMaterial } from './useWaterShaderMaterial';

interface PondMarshProps {
  position: [number, number, number];
  /** Average radius of the water body, in scene units. */
  radius: number;
  /** How irregular the shoreline is, 0 = perfect circle, 1 = very jagged. */
  irregularity?: number;
  waterLevel: number; // 0-1, drives visible size/opacity
  color?: string;
  shallowColor?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** Builds an organic, irregular blob outline (used for pond/wetland shorelines) instead of a rectangle. */
function buildIrregularShape(radius: number, irregularity: number, seed: number): THREE.Shape {
  const shape = new THREE.Shape();
  const points = 16;
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

/** Irregular-blob pond/river water body — handles `kind: 'pond' | 'river'`. */
export function PondMarsh({
  position,
  radius,
  irregularity = 0.35,
  waterLevel,
  color = '#2f6070',
  shallowColor = '#6fa8ac',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: PondMarshProps) {
  const { materialRef, uniforms, vertexShader, fragmentShader } = useWaterShaderMaterial({
    deepColor: color,
    shallowColor,
    selected,
    dimmed,
  });

  const geometry = useMemo(() => {
    const shape = buildIrregularShape(1, irregularity, position[0] * 7 + position[2] * 3);
    return new THREE.ShapeGeometry(shape, 24);
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
