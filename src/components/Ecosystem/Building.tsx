import type { ObjectClickHandler } from '../../types/threeEvents';

interface BuildingProps {
  position: [number, number, number];
  scale?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export function Building({ position, scale = 1, selected, dimmed, onClick, onPointerOver, onPointerOut }: BuildingProps) {
  const opacity = dimmed ? 0.25 : 1;
  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      <mesh position={[0, 0.5, 0]} castShadow>
        <boxGeometry args={[1.4, 1, 1.2]} />
        <meshStandardMaterial color={selected ? '#d8c9a0' : '#8a7a5f'} roughness={0.8} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.25, 0]} rotation={[0, Math.PI / 4, 0]} castShadow>
        <coneGeometry args={[1.1, 0.6, 4]} />
        <meshStandardMaterial color={selected ? '#a8664a' : '#6b3e2e'} roughness={0.9} transparent opacity={opacity} />
      </mesh>
    </group>
  );
}
