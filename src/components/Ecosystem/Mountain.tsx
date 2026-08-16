export function Mountain({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      <mesh position={[0, 3, 0]}>
        <coneGeometry args={[7, 8, 5]} />
        <meshStandardMaterial color="#3d4f52" roughness={1} />
      </mesh>
      <mesh position={[0, 6.2, 0]}>
        <coneGeometry args={[2.2, 2.6, 5]} />
        <meshStandardMaterial color="#e8ecec" roughness={0.9} />
      </mesh>
      <mesh position={[-6, 2, 3]}>
        <coneGeometry args={[5, 6, 5]} />
        <meshStandardMaterial color="#354548" roughness={1} />
      </mesh>
      <mesh position={[7, 1.5, -2]}>
        <coneGeometry args={[5.5, 5.5, 5]} />
        <meshStandardMaterial color="#3d4f52" roughness={1} />
      </mesh>
    </group>
  );
}
