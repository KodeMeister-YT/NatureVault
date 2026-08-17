import { useMemo } from 'react';
import { seededRange } from '../../utils/seededRandom';
import type { ObjectClickHandler } from '../../types/threeEvents';

interface BurrowProps {
  position: [number, number, number];
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

const TRACK_COUNT = 5;

/**
 * A small dark, dished depression marking a burrow entrance dug into the
 * ground — following DryRiverbed.tsx's sunken-plane pattern for rendering an
 * "into the ground" feature (a slightly lowered disc plus a darker inner
 * hole for depth) rather than a raised mesh. A short line of shallow oval
 * track indentations trails away from the entrance as a lightweight,
 * non-interactive storytelling detail, mirroring how DryRiverbed's scattered
 * pebbles are decorative sub-elements rather than independently clickable.
 */
export function Burrow({ position, selected, dimmed, onClick, onPointerOver, onPointerOut }: BurrowProps) {
  const opacity = dimmed ? 0.25 : 1;
  const rimColor = selected ? '#7a6248' : '#5a4832';

  const tracks = useMemo(
    () =>
      Array.from({ length: TRACK_COUNT }).map((_, i) => {
        const dist = 0.4 + i * 0.24;
        const wobble = seededRange(i * 3.7 + position[0], -0.06, 0.06);
        const rot = seededRange(i * 5.1, -0.25, 0.25);
        return { dist, wobble, rot };
      }),
    [position],
  );

  return (
    <group onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {/* dished depression — slightly sunken and darker than the surrounding sand */}
      <mesh position={[position[0], position[1] - 0.06, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.42, 16]} />
        <meshStandardMaterial color={rimColor} roughness={1} transparent opacity={opacity} />
      </mesh>
      {/* darker inner hole suggesting depth into the burrow */}
      <mesh position={[position[0], position[1] - 0.1, position[2]]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 12]} />
        <meshStandardMaterial color="#1f1712" roughness={1} transparent opacity={opacity} />
      </mesh>
      {/* short trail of shallow track indentations leading away from the entrance */}
      {tracks.map((t, i) => (
        <mesh
          key={i}
          position={[position[0] + t.wobble, position[1] - 0.03, position[2] + 0.5 + t.dist]}
          rotation={[-Math.PI / 2, 0, t.rot]}
          scale={[1, 1.5, 1]}
        >
          <circleGeometry args={[0.045, 8]} />
          <meshStandardMaterial color="#6e5a3e" roughness={1} transparent opacity={opacity * 0.85} />
        </mesh>
      ))}
    </group>
  );
}
