import type { ObjectClickHandler } from '../../types/threeEvents';

interface TropicalFlowerProps {
  position: [number, number, number];
  scale?: number;
  /** Base hue for the cluster — defaults to a hot-pink tropical bloom. */
  color?: string;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A small, static, brightly-colored flower cluster sitting near ground level —
 * similar footprint to a single MeadowPatch instance but standalone and far
 * more vivid than any existing flower-adjacent primitive (MeadowPatch's
 * yellow-green blades, Pollinator's amber bee). A few flattened
 * spheres/cones in a saturated hot-pink/orange palette on short green stems.
 */
export function TropicalFlower({
  position,
  scale = 1,
  color = '#ff2f8f',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: TropicalFlowerProps) {
  const opacity = dimmed ? 0.25 : 1;
  const bloomColor = selected ? '#ffd76a' : color;
  const accentColor = selected ? '#ffe6a0' : '#ff8a3d';

  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* short stems */}
      <mesh position={[0, 0.12, 0]}>
        <cylinderGeometry args={[0.02, 0.025, 0.24, 5]} />
        <meshStandardMaterial color="#2f6b3a" roughness={0.85} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0.14, 0.09, 0.05]}>
        <cylinderGeometry args={[0.015, 0.02, 0.18, 5]} />
        <meshStandardMaterial color="#2f6b3a" roughness={0.85} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.13, 0.08, -0.04]}>
        <cylinderGeometry args={[0.015, 0.02, 0.16, 5]} />
        <meshStandardMaterial color="#2f6b3a" roughness={0.85} transparent opacity={opacity} />
      </mesh>
      {/* main bloom — flattened sphere */}
      <mesh position={[0, 0.26, 0]} scale={[1.3, 0.55, 1.3]} castShadow>
        <sphereGeometry args={[0.16, 10, 8]} />
        <meshStandardMaterial
          color={bloomColor}
          emissive={bloomColor}
          emissiveIntensity={0.18}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      {/* smaller companion blooms, warmer accent color */}
      <mesh position={[0.14, 0.19, 0.05]} scale={[1, 0.5, 1]}>
        <coneGeometry args={[0.09, 0.1, 8]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.15}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      <mesh position={[-0.13, 0.17, -0.04]} scale={[0.85, 0.45, 0.85]}>
        <coneGeometry args={[0.08, 0.09, 8]} />
        <meshStandardMaterial
          color={accentColor}
          emissive={accentColor}
          emissiveIntensity={0.15}
          roughness={0.6}
          transparent
          opacity={opacity}
        />
      </mesh>
      {selected && (
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.22, 0.27, 20]} />
          <meshBasicMaterial color="#d8b872" />
        </mesh>
      )}
    </group>
  );
}
