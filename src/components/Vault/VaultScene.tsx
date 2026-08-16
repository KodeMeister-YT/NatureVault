import { Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useCursor } from '@react-three/drei';
import * as THREE from 'three';
import type { VaultDefinition, VaultStateMetrics } from '../../types/vault';
import type { BiodiversityCategory } from '../../types/observation';
import { Terrain } from '../Ecosystem/Terrain';
import { SkyAndClouds } from '../Ecosystem/SkyAndClouds';
import { EnvironmentalObjectRenderer } from '../Ecosystem/EnvironmentalObjectRenderer';

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

function SceneContents({
  vault,
  year,
  metrics,
  selectedObjectId,
  hoveredObjectId,
  biodiversityFilter,
  onSelect,
  onHover,
}: Omit<VaultSceneProps, 'cameraResetKey'>) {
  const visibleObjects = useMemo(
    () => vault.objects.filter((o) => o.presentInYears.includes(year)),
    [vault.objects, year],
  );

  const waterBodies = useMemo(
    () =>
      visibleObjects
        .filter((o) => o.kind === 'river' || o.kind === 'pond')
        .map((o) => ({ position: o.position, radius: o.kind === 'river' ? 9 : 4.5 })),
    [visibleObjects],
  );

  useCursor(Boolean(hoveredObjectId));

  return (
    <>
      {/* Warm low-angle sun as the key light */}
      <directionalLight
        position={[18, 14, 10]}
        intensity={2.4}
        color="#fff1d6"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-near={1}
        shadow-camera-far={60}
        shadow-camera-left={-30}
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-bias={-0.0015}
      />
      {/* Soft ambient fill so shadow side never goes fully black */}
      <ambientLight intensity={0.45} color="#cfe6df" />
      {/* Sky/ground bounce light for natural outdoor read */}
      <hemisphereLight args={['#bcd8e8', '#3c4a2e', 0.65]} />

      <SkyAndClouds developmentLevel={metrics.developmentLevel} />
      <Terrain
        developmentLevel={metrics.developmentLevel}
        waterLevel={metrics.waterLevel}
        waterBodies={waterBodies}
      />

      {visibleObjects.map((object) => {
        // Under a biodiversity filter, dim everything that isn't scenery and doesn't match the
        // active category. Scenery (no biodiversity category) stays at full visibility.
        const dimmed = Boolean(
          biodiversityFilter && object.biodiversityCategory && object.biodiversityCategory !== biodiversityFilter,
        );
        return (
          <EnvironmentalObjectRenderer
            key={object.id}
            object={object}
            vegetationDensity={metrics.vegetationDensity}
            waterLevel={metrics.waterLevel}
            biodiversityLevel={metrics.biodiversityLevel}
            developmentLevel={metrics.developmentLevel}
            selected={selectedObjectId === object.id}
            highlighted={hoveredObjectId === object.id}
            dimmed={dimmed}
            onSelect={onSelect}
            onHover={onHover}
          />
        );
      })}
    </>
  );
}

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
  return (
    <Canvas
      shadows
      camera={{ position: [0, 1.7, 9], fov: 55 }}
      dpr={[1, 1.6]}
      gl={{ antialias: true, powerPreference: 'high-performance' }}
      onCreated={({ scene }) => {
        scene.fog = new THREE.Fog('#dce8de', 18, 55);
      }}
    >
      <Suspense fallback={null}>
        <SceneContents
          vault={vault}
          year={year}
          metrics={metrics}
          selectedObjectId={selectedObjectId}
          hoveredObjectId={hoveredObjectId}
          biodiversityFilter={biodiversityFilter}
          onSelect={onSelect}
          onHover={onHover}
        />
      </Suspense>
      <OrbitControls
        key={cameraResetKey}
        makeDefault
        enableDamping
        dampingFactor={0.08}
        minDistance={2.5}
        maxDistance={32}
        minPolarAngle={Math.PI / 6}
        maxPolarAngle={Math.PI / 2.05}
        target={[0, 1.3, -2]}
      />
    </Canvas>
  );
}
