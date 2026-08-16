import type { ObjectClickHandler } from '../../types/threeEvents';

interface RockProps {
  position: [number, number, number];
  scale?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export function Rock({ position, scale = 1, selected, dimmed, onClick, onPointerOver, onPointerOut }: RockProps) {
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
      <meshStandardMaterial
        color={selected ? '#a8a396' : '#7a7568'}
        roughness={1}
        transparent
        opacity={dimmed ? 0.25 : 1}
      />
    </mesh>
  );
}
