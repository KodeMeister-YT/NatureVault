import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { Sky } from '@react-three/drei';
import { seededRange } from '../../../utils/seededRandom';
import type { AtmosphereProfile } from '../../../types/biome';

interface SkyAndCloudsProps {
  profile: AtmosphereProfile;
  developmentLevel?: number;
}

const DUST_MOTE_COUNT = 10;

/**
 * A handful of large, very-low-opacity, slowly-drifting dust motes for
 * biomes that opt in via `profile.dustHaze` (e.g. desert) — driven generically
 * by that atmosphere flag rather than any hardcoded ecosystemId check, so
 * this stays a shared, biome-agnostic effect. Kept deliberately sparse and
 * near-transparent: the goal is a "hot, hazy, expansive" read, not fog.
 */
function DustHaze() {
  const meshRefs = useRef<THREE.Mesh[]>([]);

  const motes = useMemo(
    () =>
      Array.from({ length: DUST_MOTE_COUNT }).map((_, i) => ({
        startX: seededRange(i * 9.7, -30, 30),
        z: seededRange(i * 4.3, -22, 6),
        y: seededRange(i * 6.1, 0.6, 3.2),
        speed: seededRange(i * 7.4, 0.08, 0.2),
        scale: seededRange(i * 5.5, 3, 6),
        opacity: seededRange(i * 8.9, 0.02, 0.05),
      })),
    [],
  );

  useFrame((_, delta) => {
    meshRefs.current.forEach((m, i) => {
      if (!m) return;
      m.position.x += motes[i].speed * delta;
      if (m.position.x > 36) m.position.x = -36;
    });
  });

  return (
    <>
      {motes.map((m, i) => (
        <mesh
          key={i}
          ref={(el) => {
            if (el) meshRefs.current[i] = el;
          }}
          position={[m.startX, m.y, m.z]}
          scale={m.scale}
        >
          <sphereGeometry args={[1, 6, 6]} />
          <meshBasicMaterial color="#e8d4a0" transparent opacity={m.opacity} depthWrite={false} />
        </mesh>
      ))}
    </>
  );
}

/** Simple drifting cloud blobs made of overlapping spheres, plus a sky dome. */
export function SkyAndClouds({ profile, developmentLevel = 0 }: SkyAndCloudsProps) {
  const groupRefs = useRef<THREE.Group[]>([]);

  const clouds = useMemo(
    () =>
      Array.from({ length: 5 }).map((_, i) => ({
        startX: seededRange(i * 11.3, -30, 30),
        z: seededRange(i * 5.1, -20, -5),
        y: seededRange(i * 3.7, 8, 12),
        speed: seededRange(i * 8.2, 0.15, 0.35),
        scale: seededRange(i * 6.6, 1.5, 3),
      })),
    [],
  );

  useFrame((_, delta) => {
    groupRefs.current.forEach((g, i) => {
      if (!g) return;
      g.position.x += clouds[i].speed * delta;
      if (g.position.x > 40) g.position.x = -40;
    });
  });

  // Turbidity/sun position now sourced from the active biome's atmosphere profile
  // instead of hardcoded literals, so a desert's harsh sun and a coastal haze read
  // differently without touching this component. A shorter fog.far (denser/hazier
  // atmosphere) reads as higher base turbidity; developmentLevel still adds haze on
  // top of that per-biome baseline.
  const baseTurbidity = THREE.MathUtils.clamp(10 - profile.fog.far / 8, 1.5, 8);
  const turbidity = baseTurbidity + developmentLevel * 3;

  return (
    <>
      <Sky distance={450000} sunPosition={profile.sun.position} turbidity={turbidity} rayleigh={1.2} />
      {clouds.map((c, i) => (
        <group
          key={i}
          ref={(el) => {
            if (el) groupRefs.current[i] = el;
          }}
          position={[c.startX, c.y, c.z]}
          scale={c.scale}
        >
          <mesh>
            <sphereGeometry args={[1, 8, 8]} />
            <meshStandardMaterial color="#f5f3ec" transparent opacity={0.85} />
          </mesh>
          <mesh position={[0.9, 0.1, 0.2]}>
            <sphereGeometry args={[0.7, 8, 8]} />
            <meshStandardMaterial color="#f5f3ec" transparent opacity={0.85} />
          </mesh>
          <mesh position={[-0.8, 0, -0.1]}>
            <sphereGeometry args={[0.6, 8, 8]} />
            <meshStandardMaterial color="#f5f3ec" transparent opacity={0.85} />
          </mesh>
        </group>
      ))}
      {profile.dustHaze && <DustHaze />}
    </>
  );
}
