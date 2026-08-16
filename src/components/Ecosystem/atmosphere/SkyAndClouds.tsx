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
    </>
  );
}
