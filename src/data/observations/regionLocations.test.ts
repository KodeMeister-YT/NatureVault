import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { regions, isWithinBoundingBox, haversineDistance, matchRegion } from './regionLocations';

const EXPECTED_REGION_IDS = [
  'vadodara',
  'ahmedabad',
  'mumbai',
  'delhi',
  'bengaluru',
  'hyderabad',
  'new-york',
  'portland',
];

/**
 * Unit test (Task 23.2 — region dataset completeness): asserts `regions`
 * contains exactly the 8 required region ids/labels, each with a valid
 * bounding box and a non-empty `locations` array.
 *
 * Validates: Requirements 7.1
 */
describe('regionLocations dataset completeness (Task 23.2)', () => {
  it('contains exactly 8 regions', () => {
    expect(regions.length).toBe(8);
  });

  it('contains exactly the required set of region ids', () => {
    const ids = regions.map((r) => r.id);
    expect(new Set(ids)).toEqual(new Set(EXPECTED_REGION_IDS));
    expect(ids.length).toBe(EXPECTED_REGION_IDS.length);
  });

  it('gives every region a non-empty label', () => {
    for (const region of regions) {
      expect(typeof region.label).toBe('string');
      expect(region.label.length).toBeGreaterThan(0);
    }
  });

  it('gives every region a valid, non-degenerate bounding box', () => {
    for (const region of regions) {
      const { minLat, maxLat, minLng, maxLng } = region.boundingBox;
      expect(minLat).toBeLessThan(maxLat);
      expect(minLng).toBeLessThan(maxLng);
    }
  });

  it('gives every region a centroid within its own bounding box', () => {
    for (const region of regions) {
      const { minLat, maxLat, minLng, maxLng } = region.boundingBox;
      const { latitude, longitude } = region.centroid;
      expect(latitude).toBeGreaterThanOrEqual(minLat);
      expect(latitude).toBeLessThanOrEqual(maxLat);
      expect(longitude).toBeGreaterThanOrEqual(minLng);
      expect(longitude).toBeLessThanOrEqual(maxLng);
    }
  });

  it('gives every region a non-empty locations array', () => {
    for (const region of regions) {
      expect(Array.isArray(region.locations)).toBe(true);
      expect(region.locations.length).toBeGreaterThan(0);
    }
  });

  it('gives every DemoLocation non-empty id/name/type/distanceLabel/description fields', () => {
    for (const region of regions) {
      for (const location of region.locations) {
        expect(location.id.length).toBeGreaterThan(0);
        expect(location.name.length).toBeGreaterThan(0);
        expect(location.type.length).toBeGreaterThan(0);
        expect(location.distanceLabel.length).toBeGreaterThan(0);
        expect(location.description.length).toBeGreaterThan(0);
      }
    }
  });
});

/**
 * Property-based test (Task 23.1 — Property 7: region matching
 * containment/nearest correctness): for any latitude/longitude pair,
 * `matchRegion` returns either a region whose bounding box actually contains
 * that point (when at least one such region exists), or the region whose
 * centroid has the minimum great-circle distance to that point (when no
 * region's bounding box contains it).
 *
 * Validates: Requirements 7.2, 7.3
 */
describe('matchRegion containment/nearest correctness (Property 7, Task 23.1)', () => {
  it('returns a containing region for a point constructed inside a known region\'s bounding box', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: regions.length - 1 }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        (regionIndex, latFraction, lngFraction) => {
          const region = regions[regionIndex];
          const { minLat, maxLat, minLng, maxLng } = region.boundingBox;
          const latitude = minLat + (maxLat - minLat) * latFraction;
          const longitude = minLng + (maxLng - minLng) * lngFraction;

          const result = matchRegion(latitude, longitude);

          expect(result).not.toBeNull();
          // The point was constructed to lie inside `region`'s box, so at least
          // one region's box (not necessarily this exact one, since boxes could
          // theoretically overlap) must contain it — matchRegion must therefore
          // return a *containing* region rather than falling back to nearest.
          expect(isWithinBoundingBox(latitude, longitude, result!.boundingBox)).toBe(true);
        },
      ),
    );
  });

  it('returns the nearest-centroid region for a point outside every region\'s bounding box', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -85, max: 85, noNaN: true }),
        fc.float({ min: -180, max: 180, noNaN: true }),
        (latitude, longitude) => {
          fc.pre(!regions.some((region) => isWithinBoundingBox(latitude, longitude, region.boundingBox)));

          const expectedNearest = regions.reduce((closest, region) =>
            haversineDistance({ latitude, longitude }, region.centroid) <
            haversineDistance({ latitude, longitude }, closest.centroid)
              ? region
              : closest,
          );

          const result = matchRegion(latitude, longitude);

          expect(result).not.toBeNull();
          expect(result!.id).toBe(expectedNearest.id);
        },
      ),
    );
  });

  it('never returns null for any input, since the region list is non-empty', () => {
    fc.assert(
      fc.property(
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        fc.float({ min: -1000, max: 1000, noNaN: true }),
        (latitude, longitude) => {
          expect(matchRegion(latitude, longitude)).not.toBeNull();
        },
      ),
    );
  });
});
