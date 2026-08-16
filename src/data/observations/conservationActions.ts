import type { ConservationAction } from '../../types/observation';

export const conservationActions: ConservationAction[] = [
  { id: 'ca-1', ecosystemType: 'temperate-forest', action: 'Support local reforestation or tree-planting efforts' },
  { id: 'ca-2', ecosystemType: 'temperate-forest', action: 'Stick to marked trails to reduce soil compaction and erosion' },
  { id: 'ca-3', ecosystemType: 'temperate-forest', action: 'Learn to identify invasive plant species in your area' },
  { id: 'ca-4', ecosystemType: 'wetland', action: 'Reduce litter and runoff near waterways' },
  { id: 'ca-5', ecosystemType: 'wetland', action: 'Support wetland restoration organizations' },
  { id: 'ca-6', ecosystemType: 'wetland', action: 'Learn about local water quality monitoring programs' },
  { id: 'ca-7', ecosystemType: 'wetland', action: 'Participate in a local shoreline or waterway cleanup' },
  { id: 'ca-8', ecosystemType: 'alpine', action: 'Practice Leave No Trace principles on high-elevation trails' },
  { id: 'ca-9', ecosystemType: 'alpine', action: 'Support organizations tracking snowpack and glacier change' },
  { id: 'ca-10', ecosystemType: 'urban-green-space', action: 'Plant native, pollinator-friendly species if you have outdoor space' },
  { id: 'ca-11', ecosystemType: 'urban-green-space', action: 'Volunteer with a local park or urban greening initiative' },
  { id: 'ca-12', ecosystemType: 'urban-green-space', action: 'Advocate for tree canopy and green space in local planning' },
];

export const getActionsForType = (ecosystemType: string): ConservationAction[] =>
  conservationActions.filter((a) => a.ecosystemType === ecosystemType);
