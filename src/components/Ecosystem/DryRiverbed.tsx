import { useMemo } from 'react';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface DryRiverbedProps {
  position: [number, number, number];
  length?: number;
  width?: number;
  rotationY?: number;
  pebbleCount?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A flat, cracked-earth channel tracing a former waterway — a "visual reminder
 * of what's missing" per the desert biome's design intent. It never carries
 * water; the sunken tan/clay plane plus scattered pebbles are the only cues
 * that this was once a stream bed.
 */
export function DryRiverbed({
  position,
  length = 14,
  width = 1.6,
  rotationY = 0,
  pebbleCount = 10,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: DryRiverbedProps) {
  const opacity = dimmed ? 0.25 : 1;
  const bedColor = selected ? '#c9a877' : '#a9855a';

  const pebbles = useMemo(() => {
    return Array.from({ length: pebbleCount }).map((_, i) => {
      const t = seededRange(i * 4.3 + position[0], -0.5, 0.5) * length;
      const offset = seededRange(i * 7.1 + position[2], -width * 0.35, width * 0.35);
      const size = seededRange(i * 2.9, 0.04, 0.09);
      const rot = seededRange(i * 5.5, 0, Math.PI * 2);
      return { t, offset, size, rot };
    });
  }, [pebbleCount, length, width, position]);

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* slightly sunken flat bed, reading as a dried-up channel */}
      <mesh position={[position[0], position[1] - 0.05, position[2]]} rotation={[-Math.PI / 2, 0, rotationY]}>
        <planeGeometry args={[width, length]} />
        <meshStandardMaterial color={bedColor} roughness={1} transparent opacity={opacity} />
      </mesh>
      {pebbles.map((p, i) => {
        const x = position[0] + Math.sin(rotationY) * p.t + Math.cos(rotationY) * p.offset;
        const z = position[2] + Math.cos(rotationY) * p.t - Math.sin(rotationY) * p.offset;
        return (
          <mesh key={i} position={[x, position[1] - 0.02, z]} rotation={[0.2, p.rot, 0.1]}>
            <dodecahedronGeometry args={[p.size, 0]} />
            <meshStandardMaterial color="#8a7458" roughness={1} transparent opacity={opacity} />
          </mesh>
        );
      })}
    </group>
  );
}
