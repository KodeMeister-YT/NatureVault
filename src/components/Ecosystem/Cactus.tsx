import type { ObjectClickHandler } from '../../types/threeEvents';

interface CactusProps {
  position: [number, number, number];
  scale?: number;
  selected?: boolean;
  dimmed?: boolean;
  onClick?: ObjectClickHandler;
  onPointerOver?: () => void;
  onPointerOut?: () => void;
}

/**
 * A stylized saguaro-style cactus: a tall rounded trunk with one or two smaller
 * cylindrical "arm" lobes branching off partway up. Static (no animation) —
 * deserts read as still/windless, unlike the swaying grass/reed primitives.
 */
export function Cactus({ position, scale = 1, selected, dimmed, onClick, onPointerOver, onPointerOut }: CactusProps) {
  const color = selected ? '#8fae7a' : '#5f7a54';
  const opacity = dimmed ? 0.25 : 1;

  return (
    <group
      position={position}
      scale={scale}
      onClick={onClick}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
    >
      {/* main trunk */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.16, 0.19, 1.5, 8]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>
      <mesh position={[0, 1.52, 0]} castShadow>
        <sphereGeometry args={[0.16, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2]} />
        <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
      </mesh>
      {/* lower arm lobe */}
      <group position={[0.15, 0.95, 0]} rotation={[0, 0, 0.5]}>
        <mesh position={[0, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.09, 0.11, 0.55, 8]} />
          <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0.35, 0]} rotation={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.08, 0.09, 0.4, 8]} />
          <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
        </mesh>
      </group>
      {/* upper arm lobe, opposite side */}
      <group position={[-0.13, 1.25, 0.05]} rotation={[0, 0, -0.55]}>
        <mesh position={[0, 0.22, 0]} castShadow>
          <cylinderGeometry args={[0.07, 0.09, 0.42, 8]} />
          <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
        </mesh>
        <mesh position={[0, 0.26, 0]} rotation={[0, 0, 0.45]} castShadow>
          <cylinderGeometry args={[0.06, 0.07, 0.32, 8]} />
          <meshStandardMaterial color={color} roughness={0.85} transparent opacity={opacity} />
        </mesh>
      </group>
      {(selected) && (
        <mesh position={[0, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.28, 0.34, 20]} />
          <meshBasicMaterial color="#d8b872" />
        </mesh>
      )}
    </group>
  );
}
