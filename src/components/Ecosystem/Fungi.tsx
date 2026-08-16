import type { ObjectClickHandler } from '../../types/threeEvents';

interface FungiProps {
  position: [number, number, number];
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

export function Fungi({ position, selected, dimmed, onClick, onPointerOver, onPointerOut }: FungiProps) {
  const opacity = dimmed ? 0.25 : 1;
  const color = selected ? '#e0a0c0' : '#b5568c';
  return (
    <group position={position} onClick={onClick} onPointerOver={onPointerOver} onPointerOut={onPointerOut}>
      {[0, 0.15, -0.12].map((offset, i) => (
        <group key={i} position={[offset, 0, offset * 0.6]} scale={0.5 + i * 0.15}>
          <mesh position={[0, 0.08, 0]}>
            <cylinderGeometry args={[0.03, 0.04, 0.16, 6]} />
            <meshStandardMaterial color="#e8ddc8" roughness={0.9} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0, 0.17, 0]}>
            <sphereGeometry args={[0.12, 8, 6, 0, Math.PI * 2, 0, Math.PI / 2]} />
            <meshStandardMaterial color={color} roughness={0.7} transparent opacity={opacity} />
          </mesh>
        </group>
      ))}
    </group>
  );
}
