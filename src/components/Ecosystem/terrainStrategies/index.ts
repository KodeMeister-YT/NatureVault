import type { TerrainKind } from '../../../types/biome';
import type { TerrainStrategy } from './types';
import { rollingHills } from './rollingHills';
import { flatGrassland } from './flatGrassland';
import { dunedDesert } from './dunedDesert';
import { elevatedCliffs } from './elevatedCliffs';
import { seafloor } from './seafloor';

export type { TerrainStrategy, TerrainVertexContext } from './types';

/**
 * Exhaustive registry keyed by TerrainKind. TypeScript's Record<TerrainKind, ...>
 * enforces that every TerrainKind value has a matching strategy — a missing case
 * is a compile-time error, not a silent runtime gap (design.md Property 8).
 */
export const terrainStrategies: Record<TerrainKind, TerrainStrategy> = {
  'flat-grassland': flatGrassland,
  'rolling-hills': rollingHills,
  'duned-desert': dunedDesert,
  'elevated-cliffs': elevatedCliffs,
  seafloor,
};
