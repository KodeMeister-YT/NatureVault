import { useMemo } from 'react';
import { useCursor } from '@react-three/drei';
import type { BiomeDefinition, VaultStateMetrics } from '../../types/vault';
import type { BiodiversityCategory } from '../../types/observation';
import { Terrain } from './Terrain';
import { AtmosphereRenderer } from './atmosphere/AtmosphereRenderer';
import { WaterFeatureRenderer, isWaterKindObject } from './WaterFeatureRenderer';
import { EnvironmentalObjectRenderer } from './EnvironmentalObjectRenderer';

interface SceneCompositionProps {
  biome: BiomeDefinition;
  year: number;
  metrics: VaultStateMetrics;
  selectedObjectId?: string | null;
  hoveredObjectId?: string | null;
  biodiversityFilter?: BiodiversityCategory | null;
  /** false for CompareView's MiniScene (no selection/hover wiring needed, still clickable-safe). */
  interactive: boolean;
  onSelect?: (id: string) => void;
  onHover?: (id: string | null) => void;
}

/**
 * The single render tree shared by VaultScene (interactive) and CompareView's
 * MiniScene (interactive=false): lights, fog, atmosphere, terrain, water, and
 * per-object rendering with selection/hover/dimming logic. Both consumers
 * become thin Canvas + OrbitControls wrappers around this component so
 * biome-driven rendering logic exists in exactly one place.
 */
export function SceneComposition({
  biome,
  year,
  metrics,
  selectedObjectId = null,
  hoveredObjectId = null,
  biodiversityFilter = null,
  interactive,
  onSelect,
  onHover,
}: SceneCompositionProps) {
  const visibleObjects = useMemo(() => biome.objects.filter((o) => o.presentInYears.includes(year)), [biome.objects, year]);

  const waterBodies = useMemo(
    () =>
      visibleObjects
        .filter(isWaterKindObject)
        .map((o) => ({
          position: o.position,
          featureRadius: o.featureRadius ?? (o.kind === 'river' ? 9 : 4.5),
        })),
    [visibleObjects],
  );

  useCursor(interactive && Boolean(hoveredObjectId));

  const handleSelect = (id: string) => onSelect?.(id);
  const handleHover = (id: string | null) => onHover?.(id);

  const { atmosphere } = biome;

  return (
    <>
      <fog attach="fog" args={[atmosphere.fog.color, atmosphere.fog.near, atmosphere.fog.far]} />

      <directionalLight
        position={atmosphere.sun.position}
        intensity={atmosphere.sun.intensity}
        color={atmosphere.sun.color}
        castShadow={interactive}
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
      <ambientLight intensity={atmosphere.ambient.intensity} color={atmosphere.ambient.color} />
      <hemisphereLight args={[atmosphere.hemisphere.skyColor, atmosphere.hemisphere.groundColor, atmosphere.hemisphere.intensity]} />

      <AtmosphereRenderer profile={atmosphere} developmentLevel={metrics.developmentLevel} />

      <Terrain
        config={biome.terrain}
        developmentLevel={metrics.developmentLevel}
        waterLevel={metrics.waterLevel}
        waterBodies={waterBodies}
      />

      <WaterFeatureRenderer
        objects={visibleObjects}
        waterLevel={metrics.waterLevel}
        selectedObjectId={selectedObjectId}
        dimmedIds={
          biodiversityFilter
            ? new Set(
                visibleObjects
                  .filter((o) => o.biodiversityCategory && o.biodiversityCategory !== biodiversityFilter)
                  .map((o) => o.id),
              )
            : undefined
        }
        onSelect={handleSelect}
        onHover={handleHover}
      />

      {visibleObjects
        .filter((o) => !isWaterKindObject(o))
        .map((object) => {
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
              biodiversityLevel={metrics.biodiversityLevel}
              developmentLevel={metrics.developmentLevel}
              selected={selectedObjectId === object.id}
              highlighted={hoveredObjectId === object.id}
              dimmed={dimmed}
              onSelect={handleSelect}
              onHover={handleHover}
            />
          );
        })}
    </>
  );
}
