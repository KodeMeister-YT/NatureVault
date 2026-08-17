import type { EnvironmentalObject } from '../../types/vault';
import type { WaterBody } from './Terrain';
import { isWaterKindObject } from './WaterFeatureRenderer';

/**
 * Single source of truth for turning a biome's visible water-kind objects into
 * the `WaterBody[]` shape Terrain's shoreline-carving loop (and
 * CameraGroundClamp's matching terrain-height check) both consume. Extracted
 * from SceneComposition so VaultScene can derive the same water bodies for
 * CameraGroundClamp without re-implementing this filter/map.
 */
export function deriveWaterBodies(visibleObjects: EnvironmentalObject[]): WaterBody[] {
  return visibleObjects.filter(isWaterKindObject).map((o) => ({
    position: o.position,
    featureRadius: o.featureRadius ?? (o.kind === 'river' ? 9 : 4.5),
  }));
}
