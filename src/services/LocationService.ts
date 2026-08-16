import { getDemoLocations, type DemoLocation } from '../data/observations/demoLocations';

export interface GeoResult {
  available: boolean;
  latitude?: number;
  longitude?: number;
}

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

  getFallbackLocations(ecosystemType: string): DemoLocation[] {
    return getDemoLocations(ecosystemType);
  },
};
