export interface RegionBoundingBox {
  minLat: number;
  maxLat: number;
  minLng: number;
  maxLng: number;
}

export interface DemoLocation {
  id: string;
  name: string;
  type: string;
  distanceLabel: string;
  description: string;
  exploreUrl?: string;
}

export interface RegionRecord {
  id: string;
  label: string;
  boundingBox: RegionBoundingBox;
  centroid: { latitude: number; longitude: number };
  locations: DemoLocation[];
}

export const regions: RegionRecord[] = [
  {
    id: 'vadodara',
    label: 'Vadodara, Gujarat',
    boundingBox: { minLat: 22.15, maxLat: 22.45, minLng: 73.05, maxLng: 73.35 },
    centroid: { latitude: 22.3072, longitude: 73.1812 },
    locations: [
      {
        id: 'vad-1',
        name: 'Sayaji Baug Garden & Zoo',
        type: 'Urban Forest',
        distanceLabel: 'Distance unknown',
        description: 'A large riverside park with mature shade trees, a zoo, and a small planetarium.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Sayaji+Baug+Vadodara',
      },
      {
        id: 'vad-2',
        name: 'Ajwa Nimeta Wildlife Sanctuary',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'Reservoir-fed wetlands and forest patches that draw migratory waterbirds each winter.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Ajwa+Nimeta+Wildlife+Sanctuary',
      },
      {
        id: 'vad-3',
        name: 'Vishwamitri Riverfront',
        type: 'River',
        distanceLabel: 'Distance unknown',
        description: 'A slow-moving urban river corridor known for its resident mugger crocodile population.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Vishwamitri+River+Vadodara',
      },
    ],
  },
  {
    id: 'ahmedabad',
    label: 'Ahmedabad, Gujarat',
    boundingBox: { minLat: 22.85, maxLat: 23.2, minLng: 72.4, maxLng: 72.75 },
    centroid: { latitude: 23.0225, longitude: 72.5714 },
    locations: [
      {
        id: 'ahm-1',
        name: 'Sabarmati Riverfront',
        type: 'River',
        distanceLabel: 'Distance unknown',
        description: 'A landscaped promenade along the Sabarmati River with gardens and open lawns.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Sabarmati+Riverfront+Ahmedabad',
      },
      {
        id: 'ahm-2',
        name: 'Thol Lake Wildlife Sanctuary',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'A shallow lake sanctuary that hosts flamingos, pelicans, and other migratory birds.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Thol+Lake+Wildlife+Sanctuary',
      },
      {
        id: 'ahm-3',
        name: 'Vastrapur Lake',
        type: 'Lake',
        distanceLabel: 'Distance unknown',
        description: 'A compact urban lake with a walking track and small green buffer, popular in the evenings.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Vastrapur+Lake+Ahmedabad',
      },
    ],
  },
  {
    id: 'mumbai',
    label: 'Mumbai, Maharashtra',
    boundingBox: { minLat: 18.85, maxLat: 19.3, minLng: 72.75, maxLng: 73.05 },
    centroid: { latitude: 19.076, longitude: 72.8777 },
    locations: [
      {
        id: 'mum-1',
        name: 'Sanjay Gandhi National Park',
        type: 'Tropical Forest',
        distanceLabel: 'Distance unknown',
        description: 'A large protected forest inside the city limits, home to leopards and ancient cave sites.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Sanjay+Gandhi+National+Park',
      },
      {
        id: 'mum-2',
        name: 'Mahim Nature Park',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'A reclaimed mangrove-fringed park along Mahim Creek with butterfly and bird trails.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Mahim+Nature+Park',
      },
      {
        id: 'mum-3',
        name: 'Girgaon Chowpatty Coastline',
        type: 'Marine',
        distanceLabel: 'Distance unknown',
        description: 'A city beach and tidal flat where the Arabian Sea meets Mumbai\u2019s shoreline.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Girgaon+Chowpatty',
      },
    ],
  },
  {
    id: 'delhi',
    label: 'Delhi, NCR',
    boundingBox: { minLat: 28.4, maxLat: 28.9, minLng: 76.85, maxLng: 77.35 },
    centroid: { latitude: 28.7041, longitude: 77.1025 },
    locations: [
      {
        id: 'del-1',
        name: 'Sultanpur National Park',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'A shallow wetland reserve on the Delhi-Gurugram border known for winter migratory birds.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Sultanpur+National+Park',
      },
      {
        id: 'del-2',
        name: 'Aravalli Biodiversity Park',
        type: 'Urban Forest',
        distanceLabel: 'Distance unknown',
        description: 'A restored patch of the Aravalli ridge forest with native scrub and woodland trails.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Aravalli+Biodiversity+Park+Delhi',
      },
      {
        id: 'del-3',
        name: 'Okhla Bird Sanctuary',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'A Yamuna-fed wetland sanctuary at the Delhi-Noida border with dense reedbeds.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Okhla+Bird+Sanctuary',
      },
    ],
  },
  {
    id: 'bengaluru',
    label: 'Bengaluru, Karnataka',
    boundingBox: { minLat: 12.8, maxLat: 13.15, minLng: 77.4, maxLng: 77.8 },
    centroid: { latitude: 12.9716, longitude: 77.5946 },
    locations: [
      {
        id: 'blr-1',
        name: 'Lalbagh Botanical Garden',
        type: 'Urban Forest',
        distanceLabel: 'Distance unknown',
        description: 'A historic botanical garden with a wide variety of tropical and subtropical plant species.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Lalbagh+Botanical+Garden',
      },
      {
        id: 'blr-2',
        name: 'Hebbal Lake',
        type: 'Lake',
        distanceLabel: 'Distance unknown',
        description: 'A restored lake in north Bengaluru with a walking path and seasonal pelican visitors.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Hebbal+Lake+Bengaluru',
      },
      {
        id: 'blr-3',
        name: 'Bannerghatta Biological Park',
        type: 'Tropical Forest',
        distanceLabel: 'Distance unknown',
        description: 'A forested reserve on the city\u2019s southern edge with a safari zone and rescue center.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Bannerghatta+Biological+Park',
      },
    ],
  },
  {
    id: 'hyderabad',
    label: 'Hyderabad, Telangana',
    boundingBox: { minLat: 17.2, maxLat: 17.6, minLng: 78.3, maxLng: 78.7 },
    centroid: { latitude: 17.385, longitude: 78.4867 },
    locations: [
      {
        id: 'hyd-1',
        name: 'KBR National Park',
        type: 'Urban Forest',
        distanceLabel: 'Distance unknown',
        description: 'A rocky, scrub-forested park in the middle of the city, home to spotted deer and peafowl.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=KBR+National+Park+Hyderabad',
      },
      {
        id: 'hyd-2',
        name: 'Hussain Sagar Lake',
        type: 'Lake',
        distanceLabel: 'Distance unknown',
        description: 'A large heart-shaped lake at the city\u2019s center with a promenade along its edge.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Hussain+Sagar+Lake',
      },
      {
        id: 'hyd-3',
        name: 'Manjira Wildlife Sanctuary',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'A river-fed sanctuary upstream of the city known for its mugger crocodile population.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Manjira+Wildlife+Sanctuary',
      },
    ],
  },
  {
    id: 'new-york',
    label: 'New York, New York',
    boundingBox: { minLat: 40.5, maxLat: 40.92, minLng: -74.25, maxLng: -73.7 },
    centroid: { latitude: 40.7128, longitude: -74.006 },
    locations: [
      {
        id: 'nyc-1',
        name: 'Central Park',
        type: 'Urban Forest',
        distanceLabel: 'Distance unknown',
        description: 'An 843-acre landscaped park with woodlands, meadows, and a chain of lakes and ponds.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Central+Park+New+York',
      },
      {
        id: 'nyc-2',
        name: 'Jamaica Bay Wildlife Refuge',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'A tidal salt marsh and bay refuge along the Atlantic Flyway with year-round birdwatching.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Jamaica+Bay+Wildlife+Refuge',
      },
      {
        id: 'nyc-3',
        name: 'Inwood Hill Park',
        type: 'Forest',
        distanceLabel: 'Distance unknown',
        description: 'Manhattan\u2019s last natural forest and salt marsh, with old-growth trees and rocky caves.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Inwood+Hill+Park',
      },
    ],
  },
  {
    id: 'portland',
    label: 'Portland, Oregon',
    boundingBox: { minLat: 45.2, maxLat: 45.75, minLng: -123.4, maxLng: -122.3 },
    centroid: { latitude: 45.5152, longitude: -122.6784 },
    locations: [
      {
        id: 'dl-1',
        name: 'Forest Park',
        type: 'Urban Forest',
        distanceLabel: 'Distance unknown',
        description: 'One of the largest forested urban parks in the country, laced with miles of wooded trails.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Forest+Park+Portland',
      },
      {
        id: 'dl-2',
        name: 'Tryon Creek State Natural Area',
        type: 'Temperate Forest',
        distanceLabel: 'Distance unknown',
        description: 'A forested state park along Tryon Creek with fern-lined trails and a wooden footbridge.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Tryon+Creek+State+Natural+Area',
      },
      {
        id: 'dl-3',
        name: 'Smith and Bybee Wetlands',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'One of the largest urban wetland natural areas in the country, rich with waterfowl.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Smith+and+Bybee+Wetlands',
      },
      {
        id: 'dl-4',
        name: 'Oaks Bottom Wildlife Refuge',
        type: 'Wetland',
        distanceLabel: 'Distance unknown',
        description: 'Portland\u2019s first officially designated wildlife refuge, along the Willamette River.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Oaks+Bottom+Wildlife+Refuge',
      },
      {
        id: 'dl-5',
        name: 'Timberline Trail',
        type: 'Alpine',
        distanceLabel: 'Distance unknown',
        description: 'A high-alpine loop trail circling Mount Hood with sweeping views and snowfields.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Timberline+Trail+Mount+Hood',
      },
      {
        id: 'dl-6',
        name: 'Larch Mountain Trailhead',
        type: 'Alpine Forest',
        distanceLabel: 'Distance unknown',
        description: 'A forested climb to a volcanic viewpoint overlooking the Columbia River Gorge.',
        exploreUrl: 'https://www.google.com/maps/search/?api=1&query=Larch+Mountain+Trailhead',
      },
    ],
  },
];

/** Returns true when the given coordinates fall within the bounding box, inclusive of its edges. */
export function isWithinBoundingBox(latitude: number, longitude: number, box: RegionBoundingBox): boolean {
  return (
    latitude >= box.minLat &&
    latitude <= box.maxLat &&
    longitude >= box.minLng &&
    longitude <= box.maxLng
  );
}

const EARTH_RADIUS_KM = 6371;

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance (km) between two lat/lng points using the haversine formula. */
export function haversineDistance(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  const dLat = toRadians(b.latitude - a.latitude);
  const dLng = toRadians(b.longitude - a.longitude);
  const lat1 = toRadians(a.latitude);
  const lat2 = toRadians(b.latitude);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h = sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;
  const c = 2 * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));

  return EARTH_RADIUS_KM * c;
}

/**
 * Finds the region whose bounding box contains the given coordinates. If more than one
 * region's box contains the point, the first match in array order wins. If no region's
 * box contains the point, the region with the nearest centroid (great-circle distance)
 * is returned instead. Returns null only when the region list is empty.
 */
export function matchRegion(latitude: number, longitude: number): RegionRecord | null {
  const contained = regions.find((region) => isWithinBoundingBox(latitude, longitude, region.boundingBox));
  if (contained) return contained;

  if (regions.length === 0) return null;

  return regions.reduce((closest, region) =>
    haversineDistance({ latitude, longitude }, region.centroid) <
    haversineDistance({ latitude, longitude }, closest.centroid)
      ? region
      : closest,
  );
}

// Loose keyword mapping from ecosystem type to the demo location "type" labels that
// represent it. Curated lists are small and hand-picked, so this is used only as a
// best-effort narrowing — an empty match always falls back to the region's full list
// rather than showing nothing.
const ecosystemTypeKeywords: Record<string, string[]> = {
  'temperate-forest': ['forest', 'woodland'],
  wetland: ['wetland', 'marsh', 'mangrove'],
  alpine: ['alpine', 'mountain'],
  savanna: ['savanna', 'grassland'],
  desert: ['desert'],
  'coral-reef': ['reef', 'marine', 'coral'],
  lake: ['lake', 'freshwater'],
  'tropical-forest': ['tropical', 'rainforest'],
};

/**
 * Returns the curated demo locations for a region, optionally narrowed to those whose
 * `type` label loosely matches the given ecosystem type. Defaults to the first region
 * in `regions` when `regionId` is omitted. Never returns an empty array for a
 * region that has locations — falls back to the region's full list when a type-based
 * filter would otherwise leave nothing.
 */
export function getRegionByEcosystemType(ecosystemType: string, regionId?: string): DemoLocation[] {
  const region = (regionId ? regions.find((r) => r.id === regionId) : regions[0]) ?? regions[0];
  if (!region) return [];

  const keywords = ecosystemTypeKeywords[ecosystemType];
  if (!keywords || keywords.length === 0) return region.locations;

  const filtered = region.locations.filter((location) =>
    keywords.some((keyword) => location.type.toLowerCase().includes(keyword)),
  );

  return filtered.length > 0 ? filtered : region.locations;
}
