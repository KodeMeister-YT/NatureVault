import {
  regions,
  matchRegion,
  getRegionByEcosystemType,
  type DemoLocation,
  type RegionRecord,
} from '../data/observations/regionLocations';
import type { ManualRegionOption } from '../types/biome';

export interface GeoResult {
  available: boolean;
  latitude?: number;
  longitude?: number;
}

export interface ResolvedLocation {
  status: 'resolved';
  latitude: number;
  longitude: number;
  city?: string;
  region?: string;
  country?: string;
  /** Deep link to a maps search scoped to the real resolved coordinates — no key, no fabricated POIs. */
  mapsSearchUrl: string;
  /** The region dataset (contained match, or nearest-centroid match) for these coordinates, or null if the region list is empty. */
  matchedRegion: RegionRecord | null;
  /** @deprecated derived as matchedRegion !== null; kept for compatibility */
  isWithinDemoRegion: boolean;
}

export interface UnresolvedLocation {
  status: 'denied' | 'unavailable' | 'geocode-failed';
  /** Present when geocoding failed but coordinates were obtained — still useful for a maps link. */
  latitude?: number;
  longitude?: number;
  mapsSearchUrl?: string;
}

export type LocationResult = ResolvedLocation | UnresolvedLocation;

// In-memory session cache — re-opening TakeItOutsidePanel without a page reload
// should not re-request geolocation permission or re-fetch reverse-geocoding.
let cachedResult: LocationResult | null = null;
let inFlightRequest: Promise<LocationResult> | null = null;

export const LocationService = {
  /** Attempts to get the user's location. Resolves with available:false on denial/timeout instead of throwing. */
  requestLocation(): Promise<GeoResult> {
    return new Promise((resolve) => {
      if (!('geolocation' in navigator)) {
        resolve({ available: false });
        return;
      }
      const timeout = setTimeout(() => resolve({ available: false }), 6000);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          clearTimeout(timeout);
          resolve({ available: true, latitude: pos.coords.latitude, longitude: pos.coords.longitude });
        },
        () => {
          clearTimeout(timeout);
          resolve({ available: false });
        },
        { timeout: 5000 },
      );
    });
  },

  buildMapsSearchUrl(latitude: number, longitude: number, query?: string): string {
    const q = query ? `${encodeURIComponent(query)}+near+${latitude},${longitude}` : `parks+near+${latitude},${longitude}`;
    return `https://www.google.com/maps/search/?api=1&query=${q}`;
  },

  /**
   * Resolves the user's real location via geolocation + a keyless reverse-geocode
   * fetch. Never called automatically — only in response to a user-initiated
   * "Find Nearby Nature" click. Caches the result in memory for the session so
   * re-opening the panel doesn't re-prompt/re-fetch.
   */
  async resolveLocation(): Promise<LocationResult> {
    if (cachedResult) return cachedResult;
    if (inFlightRequest) return inFlightRequest;

    inFlightRequest = (async (): Promise<LocationResult> => {
      const geo = await LocationService.requestLocation();

      if (!geo.available || geo.latitude === undefined || geo.longitude === undefined) {
        return { status: 'unavailable' };
      }

      const { latitude, longitude } = geo;
      const mapsUrlCoordsOnly = LocationService.buildMapsSearchUrl(latitude, longitude);

      try {
        const response = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`,
        );
        if (!response.ok) {
          throw new Error(`Reverse geocode request failed with status ${response.status}`);
        }
        const data = await response.json();

        const matchedRegion = matchRegion(latitude, longitude);
        const result: ResolvedLocation = {
          status: 'resolved',
          latitude,
          longitude,
          city: data.city || data.locality || undefined,
          region: data.principalSubdivision || undefined,
          country: data.countryName || undefined,
          mapsSearchUrl: LocationService.buildMapsSearchUrl(latitude, longitude),
          matchedRegion,
          isWithinDemoRegion: matchedRegion !== null,
        };
        return result;
      } catch {
        const result: UnresolvedLocation = {
          status: 'geocode-failed',
          latitude,
          longitude,
          mapsSearchUrl: mapsUrlCoordsOnly,
        };
        return result;
      }
    })();

    const result = await inFlightRequest;
    cachedResult = result;
    inFlightRequest = null;
    return result;
  },

  /** Clears the in-memory session cache — primarily for tests; "Try again" re-invokes resolveLocation() directly. */
  clearCache(): void {
    cachedResult = null;
    inFlightRequest = null;
  },

  /** Only for the explicit manual-selector fallback — clearly a curated demo list, never labeled "near you". */
  getFallbackLocations(ecosystemType: string, regionId?: string): DemoLocation[] {
    return getRegionByEcosystemType(ecosystemType, regionId);
  },

  getManualRegionOptions(): ManualRegionOption[] {
    return [
      ...regions.map((region): ManualRegionOption => ({
        id: region.id,
        label: region.label,
        isDemoDataset: true,
      })),
      { id: 'search-city', label: 'Explore near a city you type', isDemoDataset: false },
    ];
  },
};
