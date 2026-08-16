export interface DemoLocation {
  id: string;
  name: string;
  type: string;
  distanceLabel: string;
}

export const demoLocationsByEcosystemType: Record<string, DemoLocation[]> = {
  'temperate-forest': [
    { id: 'dl-1', name: 'Forest Park', type: 'Urban Forest', distanceLabel: '2.1 mi away' },
    { id: 'dl-2', name: 'Tryon Creek State Natural Area', type: 'Temperate Forest', distanceLabel: '4.8 mi away' },
  ],
  wetland: [
    { id: 'dl-3', name: 'Smith and Bybee Wetlands', type: 'Wetland', distanceLabel: '5.3 mi away' },
    { id: 'dl-4', name: 'Oaks Bottom Wildlife Refuge', type: 'Wetland', distanceLabel: '3.0 mi away' },
  ],
  alpine: [
    { id: 'dl-5', name: 'Timberline Trail', type: 'Alpine', distanceLabel: '52 mi away' },
    { id: 'dl-6', name: 'Larch Mountain Trailhead', type: 'Alpine Forest', distanceLabel: '28 mi away' },
  ],
  'urban-green-space': [
    { id: 'dl-7', name: 'Tom McCall Waterfront Park', type: 'Urban Green Space', distanceLabel: '1.2 mi away' },
    { id: 'dl-8', name: 'Laurelhurst Park', type: 'Urban Green Space', distanceLabel: '2.6 mi away' },
  ],
};

export const getDemoLocations = (ecosystemType: string): DemoLocation[] =>
  demoLocationsByEcosystemType[ecosystemType] ?? demoLocationsByEcosystemType['temperate-forest'];
