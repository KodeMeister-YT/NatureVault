import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { seededRange } from '../../../utils/seededRandom';

interface UnderwaterAmbienceProps {
  developmentLevel?: number;
}

const SHAFT_COUNT = 4;
const BUBBLE_COUNT = 24;

/**
 * Submerged-scene ambience for `skyTreatment: 'underwater-ambience'` — no sky
 * dome; instead a handful of animated translucent light-shaft planes (reusing
 * the drifting-motion pattern from SkyAndClouds' clouds) plus slow-rising
 * instanced bubble particles. The blue-green tint itself comes from the
 * biome's fog color set by SceneComposition.
 */
export function UnderwaterAmbience({ developmentLevel = 0 }: UnderwaterAmbienceProps) {
  const shaftGroupRefs = useRef<THREE.Group[]>([]);
  const bubbleMeshRef = useRef<THREE.InstancedMesh>(null);

  const shafts = useMemo(
    () =>
      Array.from({ length: SHAFT_COUNT }).map((_, i) => ({
        x: seededRange(i * 11.3, -18, 18),
        z: seededRange(i * 5.1, -14, 2),
        driftSpeed: seededRange(i * 8.2, 0.05, 0.15),
        swaySeed: seededRange(i * 6.6, 0, Math.PI * 2),
      })),
    [],
  );

  const bubbles = useMemo(
    () =>
      Array.from({ length: BUBBLE_COUNT }).map((_, i) => ({
        x: seededRange(i * 3.1, -20, 20),
        z: seededRange(i * 5.7, -20, 8),
        startY: seededRange(i * 2.3, -2, 8),
        speed: seededRange(i * 7.9, 0.4, 1.1),
        scale: seededRange(i * 4.4, 0.05, 0.14),
        swaySeed: seededRange(i * 9.1, 0, Math.PI * 2),
      })),
    [],
  );

  useFrame((state, delta) => {
    const t = state.clock.elapsedTime;
    shaftGroupRefs.current.forEach((g, i) => {
      if (!g) return;
      g.position.x += shafts[i].driftSpeed * delta;
      g.rotation.z = Math.sin(t * 0.3 + shafts[i].swaySeed) * 0.08;
      if (g.position.x > 24) g.position.x = -24;
    });

    const mesh = bubbleMeshRef.current;
    if (mesh) {
      const dummy = new THREE.Object3D();
      for (let i = 0; i < BUBBLE_COUNT; i++) {
        const b = bubbles[i];
        const y = ((b.startY + t * b.speed) % 12) - 2;
        const sway = Math.sin(t * 0.8 + b.swaySeed) * 0.3;
        dummy.position.set(b.x + sway, y, b.z);
        dummy.scale.setScalar(b.scale);
        dummy.updateMatrix();
        mesh.setMatrixAt(i, dummy.matrix);
      }
      mesh.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <>
      {/* Soft downward-angled light-shaft planes */}
      {shafts.map((s, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) shaftGroupRefs.current[i] = el;
          }}
          position={[s.x, 10, s.z]}
          rotation={[-Math.PI / 5, 0, 0]}
        >
          <mesh>
            <planeGeometry args={[2.5, 16]} />
            <meshBasicMaterial
              color="#bfe9e6"
              transparent
              opacity={0.08 + developmentLevel * -0.03}
              side={THREE.DoubleSide}
              depthWrite={false}
            />
          </mesh>
        </group>
      ))}
      {/* Slow-rising bubble particles */}
      <instancedMesh ref={bubbleMeshRef} args={[undefined, undefined, BUBBLE_COUNT]}>
        <sphereGeometry args={[1, 6, 6]} />
        <meshStandardMaterial color="#eafcfb" transparent opacity={0.55} roughness={0.3} />
      </instancedMesh>
    </>
  );
}
