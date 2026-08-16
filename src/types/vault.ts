import type { BiodiversityCategory } from './observation';

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
  | 'mountain'
  | 'rock'
  | 'building'
  | 'road'
  | 'path';

export interface EcosystemConnection {
  /** Ordered chain of nodes describing a simplified ecological relationship */
  chain: string[];
}

export interface EnvironmentalObject {
  id: string;
  kind: ObjectKind;
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

export interface VaultDefinition {
  ecosystemId: string;
  name: string;
  location: string;
  years: VaultYearState[];
  objects: EnvironmentalObject[];
  storyChapters: StoryChapter[];
}

export interface StoryChapter {
  id: string;
  title: string;
  year: number;
  narration: string;
  /** id of an object to focus the camera / highlight, if any */
  focusObjectId?: string;
  scenarioId?: string;
}
