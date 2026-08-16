import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { BiodiversityProfileService, EDUCATIONAL_DATA_DISCLAIMER } from './BiodiversityProfileService';
import type { BiomeDefinition, EnvironmentalObject } from '../types/vault';
import type { BiodiversityCategory } from '../types/observation';

const CATEGORIES: (BiodiversityCategory | null)[] = ['plants', 'birds', 'pollinators', 'wildlife', 'water', 'fungi', null];

function makeBiome(objects: EnvironmentalObject[]): BiomeDefinition {
  return {
    ecosystemId: 'test-biome',
    name: 'Test Biome',
    location: 'Nowhere',
    terrain: { kind: 'rolling-hills', palette: { primary: '#000', secondary: '#000', developed: '#000' } },
    water: { kind: 'none' },
    atmosphere: {
      skyTreatment: 'sky-and-clouds',
      sun: { color: '#fff', intensity: 1, position: [0, 1, 0] },
      ambient: { color: '#fff', intensity: 1 },
      hemisphere: { skyColor: '#fff', groundColor: '#000', intensity: 1 },
      fog: { color: '#fff', near: 1, far: 10 },
    },
    cameraDefaults: { position: [0, 1, 1], target: [0, 0, 0] },
    style: { entries: [] },
    years: [{ year: 2000, label: '2000', metrics: { vegetationDensity: 0, waterLevel: 0, biodiversityLevel: 0, developmentLevel: 0 }, summary: '', keyChanges: [] }],
    objects,
    storyChapters: [],
  };
}

const objectArb = fc.record({
  id: fc.uuid(),
  kind: fc.constant<'plant'>('plant'),
  biodiversityCategory: fc.constantFrom(...CATEGORIES),
  name: fc.constant('Test Object'),
  position: fc.constant<[number, number, number]>([0, 0, 0]),
  presentInYears: fc.uniqueArray(fc.integer({ min: 1900, max: 2100 }), { minLength: 0, maxLength: 5 }),
  description: fc.constant(''),
  ecologicalRole: fc.constant(''),
  historicalChange: fc.constant(''),
  trophicRole: fc.option(fc.constantFrom<'producer' | 'primary-consumer' | 'secondary-consumer' | 'decomposer'>(
    'producer',
    'primary-consumer',
    'secondary-consumer',
    'decomposer',
  ), { nil: undefined }),
});

/**
 * Validates: Requirements 7.7 (Property 5 in design.md — biodiversity totals never drift)
 */
describe('BiodiversityProfileService.computeProfile', () => {
  it('totalSpecies always equals the count of present-in-year objects with a non-null biodiversityCategory', () => {
    fc.assert(
      fc.property(fc.array(objectArb, { minLength: 0, maxLength: 30 }), fc.integer({ min: 1900, max: 2100 }), (objs, year) => {
        const biome = makeBiome(objs as EnvironmentalObject[]);
        const profile = BiodiversityProfileService.computeProfile(biome, year);
        const expected = objs.filter((o) => o.presentInYears.includes(year) && o.biodiversityCategory !== null).length;
        expect(profile.totalSpecies).toBe(expected);
      }),
    );
  });

  it('is a pure function — same inputs always produce the same totalSpecies', () => {
    fc.assert(
      fc.property(fc.array(objectArb, { minLength: 0, maxLength: 20 }), fc.integer({ min: 1900, max: 2100 }), (objs, year) => {
        const biome = makeBiome(objs as EnvironmentalObject[]);
        const p1 = BiodiversityProfileService.computeProfile(biome, year);
        const p2 = BiodiversityProfileService.computeProfile(biome, year);
        expect(p1.totalSpecies).toBe(p2.totalSpecies);
      }),
    );
  });

  it('returns an all-zero profile for an empty objects array', () => {
    const biome = makeBiome([]);
    const profile = BiodiversityProfileService.computeProfile(biome);
    expect(profile.totalSpecies).toBe(0);
    for (const count of Object.values(profile.byCategory)) {
      expect(count).toBe(0);
    }
    for (const count of Object.values(profile.byTrophicRole)) {
      expect(count).toBe(0);
    }
    expect(profile.disclaimer).toBe(EDUCATIONAL_DATA_DISCLAIMER);
  });

  it('unions across all years when year is omitted (no year filtering)', () => {
    const objs: EnvironmentalObject[] = [
      {
        id: 'a',
        kind: 'plant',
        biodiversityCategory: 'plants',
        name: 'A',
        position: [0, 0, 0],
        presentInYears: [1990],
        description: '',
        ecologicalRole: '',
        historicalChange: '',
      },
      {
        id: 'b',
        kind: 'plant',
        biodiversityCategory: 'birds',
        name: 'B',
        position: [0, 0, 0],
        presentInYears: [2050],
        description: '',
        ecologicalRole: '',
        historicalChange: '',
      },
    ];
    const biome = makeBiome(objs);
    const profile = BiodiversityProfileService.computeProfile(biome);
    expect(profile.totalSpecies).toBe(2);
  });
});
