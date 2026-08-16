import type { ObjectClickHandler } from '../../types/threeEvents';

interface TermiteMoundProps {
  position: [number, number, number];
  scale?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A simple tapered cone cluster — one larger central cone plus a couple of
 * smaller bump cones around its base — following Rock.tsx's build-simplicity
 * pattern. Earthy reddish-brown, distinct from every rock/log/cactus color
 * already in use.
 */
export function TermiteMound({
  position,
  scale = 1,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: TermiteMoundProps) {
  const color = selected ? '#c98f5f' : '#8a5a3a';
  const opacity = dimmed ? 0.25 : 1;

  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* central tapered mound */}
      <mesh position={[0, 0.55, 0]} rotation={[0, 0.4, 0]} castShadow>
        <coneGeometry args={[0.42, 1.1, 7]} />
        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={opacity} />
      </mesh>
      {/* smaller bumps clustered around the base */}
      <mesh position={[0.32, 0.22, 0.18]} rotation={[0, 1.1, 0]} castShadow>
        <coneGeometry args={[0.18, 0.42, 6]} />
        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.28, 0.16, -0.15]} rotation={[0, 2.3, 0]} castShadow>
        <coneGeometry args={[0.14, 0.32, 6]} />
        <meshStandardMaterial color={color} roughness={0.95} transparent opacity={opacity} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.48, 0.56, 24]} />
          <meshBasicMaterial color="#d8b872" />
        </mesh>
      )}
    </group>
  );
}
