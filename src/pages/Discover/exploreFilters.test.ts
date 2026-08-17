import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { filterEcosystems, filterCategoryToEcosystemTypes, type ExploreFilterCategory } from './exploreFilters';
import type { Ecosystem, EcosystemType } from '../../types/ecosystem';

const ECOSYSTEM_TYPES: EcosystemType[] = [
  'temperate-forest',
  'wetland',
  'alpine',
  'savanna',
  'desert',
  'coral-reef',
  'lake',
  'tropical-forest',
];

const ALL_CATEGORIES = Object.keys(filterCategoryToEcosystemTypes) as ExploreFilterCategory[];

/**
 * Restricted to plain ASCII letters/digits/spaces so that toLowerCase() round-trips
 * predictably (avoids Unicode case-folding edge cases unrelated to the substring
 * logic under test).
 */
const SAFE_CHARS = 'abcdefghijklmnopqrstuvwxyz0123456789 '.split('');
const safeStringArb = (minLength: number, maxLength: number) =>
  fc.array(fc.constantFrom(...SAFE_CHARS), { minLength, maxLength }).map((chars) => chars.join(''));

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `eco-${idCounter}`;
}

const ecosystemFixtureArb: fc.Arbitrary<Ecosystem> = fc.record({
  id: fc.constant(null).map(() => nextId()),
  name: safeStringArb(3, 20),
  type: fc.constantFrom(...ECOSYSTEM_TYPES),
  typeLabel: fc.constant('Test Type'),
  location: safeStringArb(3, 20),
  description: safeStringArb(3, 30),
  availableYears: fc.array(fc.integer({ min: 1900, max: 2100 }), { minLength: 1, maxLength: 4 }),
  heroImage: fc.constant('/images/test-hero.jpg'),
  emoji: fc.constant('🌲'),
  environmentalIndicators: fc.constant([]),
});

/**
 * Property-based test (Property 1 — Search substring round-trip): for any
 * ecosystem-like fixture and any substring drawn from its own name/location/
 * description field, filterEcosystems with that substring as the query (and
 * no active filters) includes that fixture in the result.
 *
 * Validates: Requirements 6.1
 */
describe('filterEcosystems (Property 1 — search substring round-trip)', () => {
  it('includes the source record when searched by a substring of its own name/location/description', () => {
    fc.assert(
      fc.property(
        ecosystemFixtureArb,
        fc.array(ecosystemFixtureArb, { maxLength: 5 }),
        fc.constantFrom<'name' | 'location' | 'description'>('name', 'location', 'description'),
        fc.integer({ min: 0, max: 999 }),
        fc.integer({ min: 1, max: 999 }),
        (fixture, noise, field, startSeed, lenSeed) => {
          const source = fixture[field];
          const start = startSeed % source.length;
          const maxLen = source.length - start;
          const len = Math.max(1, lenSeed % maxLen);
          const substring = source.substring(start, start + len);

          // Skip the degenerate case where the extracted substring is pure whitespace
          // (trims to empty, which trivially matches everything rather than exercising
          // the substring-matching logic).
          fc.pre(substring.trim().length > 0);

          const pool = [fixture, ...noise];
          const result = filterEcosystems(pool, substring, new Set());

          expect(result).toContain(fixture);
        },
      ),
    );
  });
});

/**
 * Property-based test (Property 2 — Filter restricts to mapped types): for any
 * non-empty subset of ExploreFilterCategory values, filterEcosystems with that
 * subset as activeFilters (and an empty search query) returns only ecosystems
 * whose type is in the union of filterCategoryToEcosystemTypes for the active
 * categories.
 *
 * Validates: Requirements 6.2
 */
describe('filterEcosystems (Property 2 — filter restricts to mapped types)', () => {
  it('only returns ecosystems whose type is in the mapped union of the active filter categories', () => {
    fc.assert(
      fc.property(
        fc.array(ecosystemFixtureArb, { maxLength: 15 }),
        fc.array(fc.constantFrom(...ALL_CATEGORIES), { minLength: 1, maxLength: ALL_CATEGORIES.length }),
        (fixtures, categoriesArr) => {
          const activeFilters = new Set(categoriesArr);
          const allowedTypes = new Set(
            Array.from(activeFilters).flatMap((f) => filterCategoryToEcosystemTypes[f]),
          );

          const result = filterEcosystems(fixtures, '', activeFilters);

          for (const ecosystem of result) {
            expect(allowedTypes.has(ecosystem.type)).toBe(true);
          }
        },
      ),
    );
  });
});
