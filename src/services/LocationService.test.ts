import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LocationService } from './LocationService';

describe('LocationService.buildMapsSearchUrl', () => {
  it('builds a coordinates-only URL when no query is given', () => {
    const url = LocationService.buildMapsSearchUrl(45.5, -122.6);
    expect(url).toBe('https://www.google.com/maps/search/?api=1&query=parks+near+45.5,-122.6');
  });

  it('encodes a free-text query and appends the coordinates', () => {
    const url = LocationService.buildMapsSearchUrl(45.5, -122.6, 'parks & trails');
    expect(url).toContain(encodeURIComponent('parks & trails'));
    expect(url).toContain('near+45.5,-122.6');
  });
});

describe('LocationService.resolveLocation status transitions', () => {
  const originalFetch = globalThis.fetch;

  beforeEach(() => {
    LocationService.clearCache();
  });

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  function mockGeolocation(behavior: 'granted' | 'denied', coords?: { latitude: number; longitude: number }) {
    const geolocation = {
      getCurrentPosition: (success: PositionCallback, error?: PositionErrorCallback) => {
        if (behavior === 'granted' && coords) {
          success({ coords: { ...coords } } as GeolocationPosition);
        } else if (error) {
          error({ code: 1, message: 'denied' } as GeolocationPositionError);
        }
      },
    };
    vi.stubGlobal('navigator', { geolocation });
  }

  it('resolves to status "resolved" when geolocation is granted and geocoding succeeds', async () => {
    mockGeolocation('granted', { latitude: 45.5, longitude: -122.6 });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ city: 'Portland', principalSubdivision: 'Oregon', countryName: 'United States' }),
    }) as unknown as typeof fetch;

    const result = await LocationService.resolveLocation();
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.city).toBe('Portland');
      expect(result.region).toBe('Oregon');
      expect(result.isWithinDemoRegion).toBe(true);
      expect(result.matchedRegion?.id).toBe('portland');
      expect(result.mapsSearchUrl).toContain('45.5,-122.6');
    }
  });

  it('populates matchedRegion for a non-Portland region (Mumbai)', async () => {
    mockGeolocation('granted', { latitude: 19.076, longitude: 72.8777 });
    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ city: 'Mumbai', principalSubdivision: 'Maharashtra', countryName: 'India' }),
    }) as unknown as typeof fetch;

    const result = await LocationService.resolveLocation();
    expect(result.status).toBe('resolved');
    if (result.status === 'resolved') {
      expect(result.matchedRegion?.id).toBe('mumbai');
      expect(result.isWithinDemoRegion).toBe(true);
    }
  });

  it('resolves to status "geocode-failed" when geolocation is granted but the geocode request fails', async () => {
    mockGeolocation('granted', { latitude: 10, longitude: 10 });
    globalThis.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 }) as unknown as typeof fetch;

    const result = await LocationService.resolveLocation();
    expect(result.status).toBe('geocode-failed');
    if (result.status !== 'resolved') {
      expect(result.latitude).toBe(10);
      expect(result.longitude).toBe(10);
      expect(result.mapsSearchUrl).toBeDefined();
    }
  });

  it('resolves to status "unavailable" when geolocation is denied', async () => {
    mockGeolocation('denied');
    const result = await LocationService.resolveLocation();
    expect(result.status).toBe('unavailable');
  });

  it('never returns a city/region value unless status is "resolved" (Property 6)', async () => {
    mockGeolocation('granted', { latitude: 10, longitude: 10 });
    globalThis.fetch = vi.fn().mockRejectedValue(new Error('network error')) as unknown as typeof fetch;

    const result = await LocationService.resolveLocation();
    expect(result.status).not.toBe('resolved');
    expect((result as { city?: string }).city).toBeUndefined();
    expect((result as { region?: string }).region).toBeUndefined();
  });
});

describe('LocationService.getManualRegionOptions', () => {
  it('returns one option per region plus the free-text city-search option (9 total)', () => {
    const options = LocationService.getManualRegionOptions();
    expect(options).toHaveLength(9);
    expect(options.filter((o) => o.isDemoDataset)).toHaveLength(8);
    expect(options.find((o) => o.id === 'search-city')).toEqual({
      id: 'search-city',
      label: 'Explore near a city you type',
      isDemoDataset: false,
    });
    expect(options.find((o) => o.id === 'portland')).toBeDefined();
    expect(options.find((o) => o.id === 'mumbai')).toBeDefined();
  });
});
