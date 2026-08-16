export type BiodiversityCategory =
  | 'plants'
  | 'birds'
  | 'pollinators'
  | 'wildlife'
  | 'water'
  | 'fungi';

export interface Observation {
  id: string;
  objectId: string;
  ecosystemId: string;
  timestamp: number;
  notes: string;
  category: BiodiversityCategory | 'general';
}

export interface ConservationAction {
  id: string;
  ecosystemType: string;
  action: string;
}
