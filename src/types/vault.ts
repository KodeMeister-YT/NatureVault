import type { BiodiversityCategory } from './observation';
import type { TerrainConfig, WaterConfig, AtmosphereProfile, CameraDefaults, BiomeStyle, TrophicRole } from './biome';

export type ObjectKind =
  | 'tree'
  | 'plant'
  | 'reed'
  | 'animal'
  | 'frog'
  | 'bird'
  | 'pollinator'
  | 'fungi'
  | 'river'
  | 'pond'
  | 'creek'
  | 'lake'
  | 'waterfall'
  | 'mountain'
  | 'rock'
  | 'building'
  | 'road'
  | 'path'
  | 'fern'
  | 'moss'
  | 'log'
  | 'cactus'
  | 'dryRiverbed'
  | 'vine'
  | 'tropicalFlower'
  | 'canopyTree'
  | 'coral'
  | 'fishSchool'
  | 'termiteMound';

export interface EcosystemConnection {
  /** Ordered chain of nodes describing a simplified ecological relationship */
  chain: string[];
}

export interface EnvironmentalObject {
  id: string;
  kind: ObjectKind;
  /** e.g. tree variant: 'conifer' | 'broadleaf' | 'palm' */
  variant?: string;
  biodiversityCategory: BiodiversityCategory | null;
  name: string;
  /** Position in the 3D scene, in scene units */
  position: [number, number, number];
  /** Years in which this object is present/visible */
  presentInYears: number[];
  description: string;
  ecologicalRole: string;
  historicalChange: string;
  relatedSpecies?: string[];
  connection?: EcosystemConnection;

  // --- NEW optional fields (additive, non-breaking) ---
  trophicRole?: TrophicRole;
  habitat?: string;
  diet?: string;
  environmentalPressures?: string[];
  /** Radius/size hint used by Terrain's shoreline carving and by WaterFeatureRenderer; replaces
   *  the previous hardcoded per-kind radius constants duplicated in VaultScene/CompareView. */
  featureRadius?: number;
}

export interface VaultStateMetrics {
  vegetationDensity: number; // 0-1
  waterLevel: number; // 0-1
  biodiversityLevel: number; // 0-1
  developmentLevel: number; // 0-1
}

export interface VaultYearState {
  year: number;
  label: string;
  metrics: VaultStateMetrics;
  /** short summary of the ecosystem at this point in time */
  summary: string;
  keyChanges: string[];
}

export interface BiomeDefinition {
  ecosystemId: string;
  name: string;
  location: string;
  years: VaultYearState[];
  objects: EnvironmentalObject[];
  storyChapters: StoryChapter[];

  // --- NEW biome config ---
  terrain: TerrainConfig;
  water: WaterConfig;
  atmosphere: AtmosphereProfile;
  cameraDefaults: CameraDefaults;
  style: BiomeStyle;
}

/** @deprecated use BiomeDefinition — kept so existing imports keep compiling during migration. */
export type VaultDefinition = BiomeDefinition;

export interface StoryChapter {
  id: string;
  title: string;
  year: number;
  narration: string;
  /** id of an object to focus the camera / highlight, if any */
  focusObjectId?: string;
  scenarioId?: string;
}
