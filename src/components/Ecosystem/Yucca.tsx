import type { ObjectClickHandler } from '../../types/threeEvents';

interface YuccaProps {
  position: [number, number, number];
  scale?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

const LEAF_COUNT = 10;

/**
 * A stylized yucca: a rosette of stiff, spiky upright leaves radiating from a
 * low woody base, topped by a tall creamy flower spike. Built as a small
 * standalone primitive (following Cactus.tsx's static-primitive pattern)
 * rather than reusing MeadowPatch — MeadowPatch's swaying grass-blade
 * instancing was considered first per the reuse-before-new-primitive
 * principle, but its blades are thin, floppy, and animated to sway in the
 * wind, which can't read as a yucca's stiff, wide, motionless rosette even
 * with a color override, and Cactus.tsx explicitly keeps deserts still/
 * windless. Static (no animation), matching that convention.
 */
export function Yucca({ position, scale = 1, selected, dimmed, onClick, onPointerOver, onPointerOut }: YuccaProps) {
  const leafColor = selected ? '#9ab08e' : '#6e7c5e';
  const spikeColor = selected ? '#a8b89a' : '#7c8a6c';
  const opacity = dimmed ? 0.25 : 1;

  const leaves = Array.from({ length: LEAF_COUNT }).map((_, i) => {
    const angle = (i / LEAF_COUNT) * Math.PI * 2 + (i % 2) * 0.15;
    const tilt = 0.5 + (i % 3) * 0.06;
    return { angle, tilt };
  });

  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* low woody base */}
      <mesh position={[0, 0.08, 0]} castShadow>
        <cylinderGeometry args={[0.12, 0.15, 0.16, 8]} />
        <meshStandardMaterial color="#7a6a4e" roughness={0.9} transparent opacity={opacity} />
      </mesh>
      {/* rosette of stiff spiky leaves, tilted outward and upward from the base */}
      {leaves.map(({ angle, tilt }, i) => (
        <group key={i} rotation={[0, angle, 0]}>
          <mesh position={[0, 0.16 + Math.cos(tilt) * 0.24, Math.sin(tilt) * 0.24]} rotation={[tilt, 0, 0]} castShadow>
            <coneGeometry args={[0.035, 0.5, 5]} />
            <meshStandardMaterial color={leafColor} roughness={0.85} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
      {/* tall creamy flower spike rising from the rosette's center */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.02, 0.03, 0.9, 6]} />
        <meshStandardMaterial color={spikeColor} roughness={0.8} transparent opacity={opacity} />
      </mesh>
      {Array.from({ length: 5 }).map((_, i) => (
        <mesh key={i} position={[Math.sin(i) * 0.05, 0.92 + i * 0.08, Math.cos(i) * 0.05]} castShadow>
          <sphereGeometry args={[0.05, 6, 6]} />
          <meshStandardMaterial color="#f0e8c8" roughness={0.6} transparent opacity={opacity} />
        </mesh>
      ))}
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 20]} />
          <meshBasicMaterial color="#d8b872" />
        </mesh>
      )}
    </group>
  );
}
