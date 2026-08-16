import { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { VaultDefinition, VaultStateMetrics } from '../../types/vault';
import type { BiodiversityCategory } from '../../types/observation';
import { SceneComposition } from '../Ecosystem/SceneComposition';

interface VaultSceneProps {
  vault: VaultDefinition;
  year: number;
  metrics: VaultStateMetrics;
  selectedObjectId: string | null;
  hoveredObjectId: string | null;
  biodiversityFilter: BiodiversityCategory | null;
  onSelect: (id: string) => void;
  onHover: (id: string | null) => void;
  cameraResetKey: number;
}

/**
 * Thin Canvas + OrbitControls wrapper around the shared SceneComposition
 * render tree, using the biome's own cameraDefaults instead of a hardcoded
 * camera prop.
 */
export function VaultScene({
  vault,
  year,
  metrics,
  selectedObjectId,
  hoveredObjectId,
  biodiversityFilter,
  onSelect,
  onHover,
  cameraResetKey,
}: VaultSceneProps) {
  const { cameraDefaults } = vault;

  return (
    <Canvas
      shadows
      camera={{ position: cameraDefaults.position, fov: cameraDefaults.fov ?? 55 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
    >
      <Suspense fallback={null}>
        <SceneComposition
          biome={vault}
          year={year}
          metrics={metrics}
          selectedObjectId={selectedObjectId}
          hoveredObjectId={hoveredObjectId}
          biodiversityFilter={biodiversityFilter}
          interactive
          onSelect={onSelect}
          onHover={onHover}
        />
      </Suspense>
      <OrbitControls
        key={cameraResetKey}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={cameraDefaults.minDistance ?? 2.5}
        maxDistance={cameraDefaults.maxDistance ?? 32}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={cameraDefaults.maxPolarAngle ?? Math.PI / 2.05}
        target={cameraDefaults.target}
      />
    </Canvas>
  );
}
