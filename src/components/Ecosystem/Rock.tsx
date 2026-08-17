import type { ObjectClickHandler } from '../../types/threeEvents';

export type RockShape = 'boulder' | 'slab' | 'layered';

interface RockProps {
  position: [number, number, number];
  scale?: number;
  /** Biome-specific base (unselected) color, resolved via resolveBiomeStyle. Ignored when selected. */
  colorOverride?: string;
  /**
   * Geometry variant. Defaults to `'boulder'` (the original single fixed
   * dodecahedron shape) so every existing rock object across every biome
   * renders identically to before this prop was introduced. `'slab'` is a
   * flatter, wider dodecahedron reading as a low outcrop; `'layered'` is a
   * stretched box reading as a stacked, weathered rock formation.
   */
  shape?: RockShape;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export function Rock({
  position,
  scale = 1,
  colorOverride,
  shape = 'boulder',
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: RockProps) {
  const color = selected ? '#a8a396' : colorOverride ?? '#7a7568';
  const opacity = dimmed ? 0.25 : 1;

  if (shape === 'slab') {
    return (
      <mesh
        position={position}
        scale={[scale * 1.4, scale * 0.55, scale * 1.1]}
        rotation={[0.15, 0.5, 0.05]}
        castShadow
        onClick={onClick}
        onPointerOver={onPointerOver}
        onPointerOut={onPointerOut}
      >
        <dodecahedronGeometry args={[0.5, 0]} />
        <meshStandardMaterial color={color} roughness={1} transparent opacity={opacity} />
      </mesh>
    );
  }

  if (shape === 'layered') {
    return (
      <group position={position} scale={scale} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
        <mesh position={[0, 0, 0]} rotation={[0.05, 0.4, 0]} castShadow>
          <boxGeometry args={[0.7, 0.3, 0.55]} />
          <meshStandardMaterial color={color} roughness={1} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0.06, 0.28, -0.03]} rotation={[0.08, 0.6, -0.04]} castShadow>
          <boxGeometry args={[0.55, 0.26, 0.45]} />
          <meshStandardMaterial color={color} roughness={1} transparent opacity={opacity} />
        </mesh>
        <mesh position={[-0.04, 0.5, 0.02]} rotation={[-0.05, 0.2, 0.06]} castShadow>
          <boxGeometry args={[0.4, 0.22, 0.34]} />
          <meshStandardMaterial color={color} roughness={1} transparent opacity={opacity} />
        </mesh>
      </group>
    );
  }

  return (
    <mesh
      position={position}
      scale={scale}
      rotation={[0.3, 0.6, 0.1]}
      castShadow
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <dodecahedronGeometry args={[0.5, 0]} />
      <meshStandardMaterial color={color} roughness={1} transparent opacity={opacity} />
    </mesh>
  );
}
