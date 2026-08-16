// Core ecosystem data models for NatureVault

export type EcosystemType =
  | 'temperate-forest'
  | 'wetland'
  | 'alpine'
  | 'savanna'
  | 'desert'
  | 'coral-reef'
  | 'lake'
  | 'tropical-forest';

export interface EnvironmentalIndicator {
  label: string;
  value: number; // 0-100 illustrative index
  unit?: string;
}

export interface Ecosystem {
  id: string;
  name: string;
  type: EcosystemType;
  typeLabel: string;
  location: string;
  description: string;
  availableYears: number[];
  heroImage: string;
  emoji: string;
  environmentalIndicators: EnvironmentalIndicator[];
  featured?: boolean;
}
