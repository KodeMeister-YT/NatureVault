// Biome-specific configuration types composed into BiomeDefinition (see types/vault.ts).
// See .kiro/specs/biome-architecture-expansion/design.md section "Components and Interfaces" #1.

export type TerrainKind = 'flat-grassland' | 'rolling-hills' | 'duned-desert' | 'elevated-cliffs' | 'seafloor';

export interface TerrainPalette {
  primary: string; // e.g. lush grass / sand / stone
  secondary: string; // e.g. dry grass / rock crevice
  shoreline?: string; // mud/sand near water — omitted if water.kind === 'none'
  developed: string; // tint blended in as developmentLevel rises
}

export interface TerrainConfig {
  kind: TerrainKind;
  palette: TerrainPalette;
  /** Strategy-specific tuning, validated per-kind by the matching strategy impl. */
  params?: {
    duneAmplitude?: number; // duned-desert
    cliffFaces?: number; // elevated-cliffs: count of angular cliff faces
    elevationScale?: number; // elevated-cliffs / rolling-hills
    seafloorDepth?: number; // seafloor: how far below the "surface" the floor sits
  };
}

export type WaterKind = 'none' | 'creek-stream' | 'pond-marsh' | 'lake-shoreline' | 'waterfall' | 'underwater-ambient';

export interface WaterConfig {
  kind: WaterKind;
  /** Base tint used by whichever water primitives this biome instantiates. */
  deepColor?: string;
  shallowColor?: string;
}

export type SkyTreatment = 'sky-and-clouds' | 'underwater-ambience';

export interface AtmosphereProfile {
  skyTreatment: SkyTreatment;
  sun: { color: string; intensity: number; position: [number, number, number] };
  ambient: { color: string; intensity: number };
  hemisphere: { skyColor: string; groundColor: string; intensity: number };
  fog: { color: string; near: number; far: number };
}

export interface CameraDefaults {
  position: [number, number, number];
  target: [number, number, number];
  fov?: number;
  minDistance?: number;
  maxDistance?: number;
  maxPolarAngle?: number;
}

/** Per-ObjectKind (+ optional variant) visual overrides, so recoloring doesn't require new primitives. */
export interface BiomeStyleEntry {
  kind: import('./vault').ObjectKind;
  variant?: string;
  colorPrimary?: string;
  colorAccent?: string;
  densityMultiplier?: number; // scales instanced counts, e.g. grass/reed/coral density
}

export interface BiomeStyle {
  entries: BiomeStyleEntry[];
}

export type TrophicRole = 'producer' | 'primary-consumer' | 'secondary-consumer' | 'decomposer';

export interface BiodiversityProfile {
  totalSpecies: number;
  byCategory: Record<import('./observation').BiodiversityCategory, number>;
  byTrophicRole: Record<TrophicRole, number>;
  /** Always shown alongside the profile — this is illustrative content, not a scientific survey. */
  disclaimer: string;
}

export interface ManualRegionOption {
  id: string;
  label: string; // e.g. "Pacific Northwest (demo)"
  isDemoDataset: boolean; // true -> shows curated demoLocations; false -> free-text city search only
}
