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

  // --- NEW optional fields (additive) ---
  isCaptured?: boolean;             // true only for explicit "Save to Nature Journal" actions
  userNote?: string;                // the user's own optional free-text note at capture time
  objectName?: string;              // denormalized so the Journal never needs a stale object lookup
  ecosystemName?: string;
  year?: number;                    // the year being viewed at capture time
  ecologicalSignificance?: string;  // snapshot of object.ecologicalRole at capture time
}

export interface ConservationAction {
  id: string;
  ecosystemType: string;
  action: string;
}
