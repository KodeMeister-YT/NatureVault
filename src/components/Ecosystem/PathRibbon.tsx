import type { ObjectClickHandler } from '../../types/threeEvents';

interface PathRibbonProps {
  position: [number, number, number];
  length?: number;
  width?: number;
  rotationY?: number;
  color?: string;
  selected?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/** Flat ribbon used for both dirt paths and roads. */
export function PathRibbon({
  position,
  length = 10,
  width = 0.8,
  rotationY = 0,
  color = '#9c8a68',
  selected,
  onClick,
  onPointerOver,
  onPointerOut,
}: PathRibbonProps) {
  return (
    <mesh
      position={[position[0], position[1] + 0.01, position[2]]}
      rotation={[-Math.PI / 2, 0, rotationY]}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <planeGeometry args={[width, length]} />
      <meshStandardMaterial color={selected ? '#c7b48a' : color} roughness={1} />
    </mesh>
  );
}
