import type { ObjectClickHandler } from '../../types/threeEvents';

interface FallenLogProps {
  position: [number, number, number];
  scale?: number;
  /** Rotation around the vertical axis, for natural-looking placement variety. */
  rotationY?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A static, horizontal elongated cylinder lying on the ground — follows
 * Tree.tsx's trunk cylinder geometry pattern but rotated on its side, with a
 * couple of small moss-tuft accents on top to read as decomposing deadwood.
 */
export function FallenLog({
  position,
  scale = 1,
  rotationY = 0,
  selected,
  dimmed,
  onClick,
  onPointerOver,
  onPointerOut,
}: FallenLogProps) {
  const opacity = dimmed ? 0.25 : 1;
  const barkColor = selected ? '#8a7358' : '#5a4a3a';

  return (
    <group
      position={position}
      scale={scale}
      rotation={[0, rotationY, 0]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* main log body, lying on its side along the local x-axis */}
      <mesh position={[0, 0.22, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.22, 0.26, 1.8, 8]} />
        <meshStandardMaterial color={barkColor} roughness={0.95} transparent opacity={opacity} />
      </mesh>
      {/* small moss-tuft accents on top, breaking up the bark silhouette */}
      <mesh position={[0.5, 0.42, 0.05]} scale={0.12}>
        <sphereGeometry args={[1, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#9cae5a" roughness={0.95} transparent opacity={opacity} />
      </mesh>
      <mesh position={[-0.3, 0.42, -0.06]} scale={0.09}>
        <sphereGeometry args={[1, 6, 4, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color="#8a9e4e" roughness={0.95} transparent opacity={opacity} />
      </mesh>
      {selected && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35, 0.42, 24]} />
          <meshBasicMaterial color="#d8b872" />
        </mesh>
      )}
    </group>
  );
}
