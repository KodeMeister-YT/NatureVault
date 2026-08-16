import { useMemo } from 'react';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../../types/threeEvents';
import { useWaterShaderMaterial } from './useWaterShaderMaterial';

interface CreekStreamProps {
  position: [number, number, number];
  /** Half-length of the creek along its flow direction, in scene units. */
  length?: number;
  /** Half-width of the creek's channel, in scene units. */
  width?: number;
  rotationY?: number;
  waterLevel: number;
  color?: string;
  shallowColor?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** Builds a narrow, gently meandering ribbon shape — reads as a flowing creek/stream. */
function buildCreekShape(): THREE.Shape {
  const shape = new THREE.Shape();
  // Local coordinates: x is the narrow width axis (-0.3..0.3), y is the flow axis (-1..1).
  shape.moveTo(-0.3, -1);
  shape.quadraticCurveTo(-0.5, -0.3, -0.25, 0.1);
  shape.quadraticCurveTo(-0.15, 0.6, -0.3, 1);
  shape.lineTo(0.3, 1);
  shape.quadraticCurveTo(0.15, 0.6, 0.25, 0.1);
  shape.quadraticCurveTo(0.5, -0.3, 0.3, -1);
  shape.closePath();
  return shape;
}

/** Narrow, elongated, directionally-flowing water body — handles `kind: 'creek'`. */
export function CreekStream({
  position,
  length = 9,
  width = 1.4,
  rotationY = 0,
  waterLevel,
  color = '#2b6a72',
  shallowColor = '#7fb8bc',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: CreekStreamProps) {
  const { materialRef, uniforms, vertexShader, fragmentShader } = useWaterShaderMaterial({
    deepColor: color,
    shallowColor,
    selected,
    dimmed,
    flowAxis: 'vertical',
    flowSpeed: 0.6,
  });

  const geometry = useMemo(() => new THREE.ShapeGeometry(buildCreekShape(), 12), []);

  const scaleY = length * (0.9 + waterLevel * 0.2);
  const scaleX = width * (0.9 + waterLevel * 0.2);

  return (
    <mesh
      position={[position[0], position[1] - 0.08, position[2]]}
      rotation={[-Math.PI / 2, 0, rotationY]}
      scale={[scaleX, scaleY, 1]}
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
