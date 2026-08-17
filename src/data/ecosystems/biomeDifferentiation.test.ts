import { describe, expect, it } from 'vitest';
import { vaults } from './vaults';
import { coastalWetlandVault } from './coastalWetland';
import { evergreenValleyVault } from './evergreenValley';
import { tropicalForestVault } from './tropicalForest';
import { desertVault } from './desert';
import { alpineEcosystemVault } from './alpineEcosystem';
import { freshwaterLakeVault } from './freshwaterLake';
import { grasslandSavannaVault } from './grasslandSavanna';
import { coralReefVault } from './coralReef';
import { kindLabel } from '../../components/ObjectInspector/ObjectInspector';
import type { ObjectKind } from '../../types/vault';

const WATER_KINDS = new Set(['river', 'pond', 'creek', 'lake', 'waterfall']);

/** Returns true if a hex color's green channel is the dominant (or co-dominant/max) channel. */
function isGreenDominant(hex: string): boolean {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.slice(0, 2), 16);
  const g = parseInt(clean.slice(2, 4), 16);
  const b = parseInt(clean.slice(4, 6), 16);
  return g >= r && g > b;
}

/**
 * Validates: Requirements 1.3-1.10 (per-biome required-element presence/absence),
 * 1.5 (Tropical Forest current-year density >= Temperate Forest), and 1.11
 * (every ObjectKind has a corresponding ObjectInspector kindLabel entry).
 *
 * This suite is a data-authoring guard: it walks each biome's authored `objects`
 * array and asserts the specific kinds/variants required by the biome
 * differentiation requirements are present (or, for the negative assertions,
 * specifically absent), following the existing `waterConsistency.test.ts` /
 * `desert.test.ts` / `coralReef.test.ts` presence-and-absence test patterns.
 */
describe('biome differentiation — per-biome required elements (Requirements 1.3-1.10)', () => {
  describe('Coastal Wetland (1.3)', () => {
    const objects = coastalWetlandVault.objects;

    it('has a tidal channel (river) and a shallow marsh pool (pond) distinct from it', () => {
      const channel = objects.find((o) => o.kind === 'river');
      const pool = objects.find((o) => o.kind === 'pond');
      expect(channel).toBeDefined();
      expect(pool).toBeDefined();
      // The pool must read as visually distinct (smaller) than the tidal channel.
      const channelRadius = channel?.featureRadius ?? 9;
      const poolRadius = pool?.featureRadius ?? 4.5;
      expect(poolRadius).toBeLessThan(channelRadius);
    });

    it('has reeds and mangrove-styled coastal vegetation', () => {
      const reeds = objects.filter((o) => o.kind === 'reed' && o.variant !== 'mangrove');
      const mangrove = objects.filter((o) => o.kind === 'reed' && o.variant === 'mangrove');
      expect(reeds.length).toBeGreaterThanOrEqual(1);
      expect(mangrove.length).toBeGreaterThanOrEqual(1);
    });

    it('has at least one crab, one bird, one visible fish, and one amphibian', () => {
      expect(objects.filter((o) => o.kind === 'crab').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'bird').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'fishSchool').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'frog').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Temperate Forest / Evergreen Valley (1.4)', () => {
    const objects = evergreenValleyVault.objects;

    it('has tall trees, ferns, moss, >=2 fallen logs, >=2 mushroom clusters, a narrow creek, and woodland wildlife', () => {
      expect(objects.filter((o) => o.kind === 'tree').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'fern').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'moss').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'log').length).toBeGreaterThanOrEqual(2);
      expect(objects.filter((o) => o.kind === 'fungi').length).toBeGreaterThanOrEqual(2);
      expect(objects.filter((o) => o.kind === 'creek').length).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'bird' || o.kind === 'animal').length,
      ).toBeGreaterThanOrEqual(1);
    });

    it('has no lake-kind object anywhere', () => {
      expect(objects.filter((o) => o.kind === 'lake')).toHaveLength(0);
    });
  });

  describe('Tropical Forest (1.5)', () => {
    const objects = tropicalForestVault.objects;

    it('has canopy trees, vines, tropical flowers, a flying-insect object, birds, a waterfall, and forest-floor coverage', () => {
      expect(objects.filter((o) => o.kind === 'canopyTree').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'vine').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'tropicalFlower').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'pollinator').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'bird').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'waterfall').length).toBeGreaterThanOrEqual(1);
      const forestFloorKinds = new Set(['fern', 'moss', 'log', 'fungi']);
      expect(objects.filter((o) => forestFloorKinds.has(o.kind)).length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Desert (1.6)', () => {
    const objects = desertVault.objects;

    it('has dune terrain, rocks, cacti, a dry-shrub, a distant mountain, a dry riverbed, and wildlife', () => {
      expect(desertVault.terrain.kind).toBe('duned-desert');
      expect(objects.filter((o) => o.kind === 'rock').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'cactus').length).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'plant' && o.variant === 'dryShrub').length,
      ).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'mountain').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'dryRiverbed').length).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'bird' || o.kind === 'animal').length,
      ).toBeGreaterThanOrEqual(1);
    });

    it('has no water-kind object and terrain.water.kind is "none"', () => {
      expect(desertVault.water.kind).toBe('none');
      expect(objects.filter((o) => WATER_KINDS.has(o.kind))).toHaveLength(0);
    });

    it('has no green-dominant hex value in terrain.palette', () => {
      const { palette } = desertVault.terrain;
      const paletteColors = [palette.primary, palette.secondary, palette.shoreline, palette.developed].filter(
        (c): c is string => Boolean(c),
      );
      for (const color of paletteColors) {
        expect(isGreenDominant(color), `expected ${color} to not be green-dominant`).toBe(false);
      }
    });
  });

  describe('Alpine (1.7)', () => {
    const objects = alpineEcosystemVault.objects;

    it('has elevated cliff terrain, a conifer tree, an alpine meadow, rocks, a snow patch, a mountain stream, and wildlife', () => {
      expect(alpineEcosystemVault.terrain.kind).toBe('elevated-cliffs');
      expect(
        objects.filter((o) => o.kind === 'tree' && o.variant === 'conifer').length,
      ).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'plant').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'rock').length).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'rock' && o.variant === 'snowPatch').length,
      ).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'river').length).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'bird' || o.kind === 'animal').length,
      ).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Freshwater Lake (1.8)', () => {
    const objects = freshwaterLakeVault.objects;

    it('has a lake with featureRadius greater than any pond-kind featureRadius across all 8 biomes', () => {
      const lakeObject = objects.find((o) => o.kind === 'lake');
      expect(lakeObject).toBeDefined();
      const lakeRadius = lakeObject?.featureRadius ?? 14;

      const allPondRadii = Object.values(vaults).flatMap((biome) =>
        biome.objects.filter((o) => o.kind === 'pond').map((o) => o.featureRadius ?? 4.5),
      );
      expect(allPondRadii.length).toBeGreaterThan(0);
      for (const pondRadius of allPondRadii) {
        expect(lakeRadius).toBeGreaterThan(pondRadius);
      }
    });

    it('has aquatic vegetation, a duck, a frog, a dragonfly, and a visible fish', () => {
      expect(
        objects.filter((o) => o.kind === 'reed' && o.variant === 'aquaticVegetation').length,
      ).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'bird' && o.variant === 'duck').length,
      ).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'frog').length).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'pollinator' && o.variant === 'dragonfly').length,
      ).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'fishSchool').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Grassland/Savanna (1.9)', () => {
    const objects = grasslandSavannaVault.objects;

    it('has flat-grassland terrain, tall grass, scattered trees, shrubs, a watering hole, termite mounds, grazers, birds, and a flying insect', () => {
      expect(grasslandSavannaVault.terrain.kind).toBe('flat-grassland');
      expect(
        objects.filter((o) => o.kind === 'plant' && o.variant === 'tallGrass').length,
      ).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'tree').length).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'plant' && o.variant === 'shrub').length,
      ).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'pond').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'termiteMound').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'animal').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'bird').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'pollinator').length).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Coral Reef (1.10)', () => {
    const objects = coralReefVault.objects;
    const TERRESTRIAL_KINDS = new Set<ObjectKind>(['tree', 'canopyTree', 'building', 'road', 'path', 'cactus']);

    it('has seafloor terrain, coral, a turtle, an anemone, marine vegetation, rocks, and multiple fish schools', () => {
      expect(coralReefVault.terrain.kind).toBe('seafloor');
      expect(objects.filter((o) => o.kind === 'coral').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'turtle').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'anemone').length).toBeGreaterThanOrEqual(1);
      expect(
        objects.filter((o) => o.kind === 'reed' && o.variant === 'kelp').length,
      ).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'rock').length).toBeGreaterThanOrEqual(1);
      expect(objects.filter((o) => o.kind === 'fishSchool').length).toBeGreaterThanOrEqual(2);
    });

    it('has no terrestrial terrain, no non-underwater water-kind object, and no tree/canopyTree/building/road/path/cactus object', () => {
      expect(coralReefVault.water.kind).toBe('underwater-ambient');
      expect(objects.filter((o) => WATER_KINDS.has(o.kind))).toHaveLength(0);
      expect(objects.filter((o) => TERRESTRIAL_KINDS.has(o.kind))).toHaveLength(0);
    });
  });
});

/**
 * Validates: Requirement 1.5 — Tropical Forest must read as visually denser than
 * Temperate Forest in their respective current (latest-authored) years.
 */
describe('Tropical Forest density vs Temperate Forest (Requirement 1.5)', () => {
  it("Tropical Forest's current-year visible object count is >= Temperate Forest's", () => {
    const tropicalCurrentYear = tropicalForestVault.years[tropicalForestVault.years.length - 1].year;
    const temperateCurrentYear = evergreenValleyVault.years[evergreenValleyVault.years.length - 1].year;

    const tropicalCount = tropicalForestVault.objects.filter((o) =>
      o.presentInYears.includes(tropicalCurrentYear),
    ).length;
    const temperateCount = evergreenValleyVault.objects.filter((o) =>
      o.presentInYears.includes(temperateCurrentYear),
    ).length;

    expect(tropicalCount).toBeGreaterThanOrEqual(temperateCount);
  });
});

/**
 * Validates: Requirement 1.11 — every ObjectKind authored anywhere in the vaults
 * map (including newly introduced kinds like crab/turtle/anemone) must have a
 * corresponding ObjectInspector kindLabel entry, so the inspector never renders a
 * raw/unlabeled kind string.
 */
describe('ObjectInspector kindLabel coverage (Requirement 1.11)', () => {
  it('every ObjectKind used across the vaults map has a kindLabel entry', () => {
    const usedKinds = new Set<string>();
    for (const biome of Object.values(vaults)) {
      for (const object of biome.objects) {
        usedKinds.add(object.kind);
      }
    }

    const missingLabels = [...usedKinds].filter((kind) => !(kind in kindLabel));
    expect(missingLabels, `missing kindLabel entries for: ${missingLabels.join(', ')}`).toHaveLength(0);
  });
});
