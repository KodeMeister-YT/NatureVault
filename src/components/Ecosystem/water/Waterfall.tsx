import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import type { ObjectClickHandler } from '../../../types/threeEvents';
import { seededRange } from '../../../utils/seededRandom';
import { useWaterShaderMaterial } from './useWaterShaderMaterial';

interface WaterfallProps {
  position: [number, number, number];
  height?: number;
  width?: number;
  waterLevel: number;
  color?: string;
  shallowColor?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

const FOAM_COUNT = 14;

/**
 * Near-vertical plane with a fast one-directional flow, plus a small instanced
 * foam/splash burst at its base — handles `kind: 'waterfall'`.
 */
export function Waterfall({
  position,
  height = 6,
  width = 2.2,
  waterLevel,
  color = '#3f7f8c',
  shallowColor = '#bfe8ea',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: WaterfallProps) {
  const { materialRef, uniforms, vertexShader, fragmentShader } = useWaterShaderMaterial({
    deepColor: color,
    shallowColor,
    selected,
    dimmed,
    flowAxis: 'vertical',
    flowSpeed: 2.2,
  });

  const geometry = useMemo(() => new THREE.PlaneGeometry(2, 2, 1, 8), []);

  const scaleY = height * (0.9 + waterLevel * 0.2);
  const scaleX = width * (0.9 + waterLevel * 0.2);

  const foamMeshRef = useRef<THREE.InstancedMesh>(null);
  const foamTransforms = useMemo(
    () =>
      Array.from({ length: FOAM_COUNT }).map((_, i) => ({
        angle: seededRange(i * 3.1, 0, Math.PI * 2),
        r: seededRange(i * 5.7, 0.2, width * 0.6),
        bobSeed: seededRange(i * 7.9, 0, Math.PI * 2),
        scale: seededRange(i * 2.3, 0.15, 0.32),
      })),
    [width],
  );

  useFrame((state) => {
    const mesh = foamMeshRef.current;
    if (!mesh) return;
    const t = state.clock.elapsedTime;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < FOAM_COUNT; i++) {
      const { angle, r, bobSeed, scale } = foamTransforms[i];
      const x = Math.cos(angle) * r;
      const z = Math.sin(angle) * r * 0.6;
      const y = Math.sin(t * 2.4 + bobSeed) * 0.08;
      dummy.position.set(x, y, z);
      dummy.scale.setScalar(scale * (0.85 + waterLevel * 0.3));
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <group position={position}>
      <mesh
        position={[0, height / 2 - 0.08, 0]}
        rotation={[0, 0, 0]}
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
      {/* Foam/splash burst at the base */}
      <instancedMesh ref={foamMeshRef} args={[undefined, undefined, FOAM_COUNT]} position={[0, -0.05, 0]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="#f2fbfb" transparent opacity={dimmed ? 0.15 : 0.75} roughness={0.6} />
      </instancedMesh>
    </group>
  );
}
