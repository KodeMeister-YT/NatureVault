/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { VaultService } from '../../services/VaultService';
import { BiodiversityProfileService } from '../../services/BiodiversityProfileService';

/**
 * `EcosystemOverviewPanel`'s health-percentage/species-count/key-features/main-pressures
 * derivation and its dismissal contract (owned by `VaultPage`). This project has no
 * `@testing-library/react` (or similar) DOM-render harness installed (see
 * ScenarioSwitcher.test.ts / EcosystemCard.test.ts / TakeItOutsidePanel.test.ts), so this
 * test follows the same established pattern: independent recomputation of the design.md
 * formula/derivation logic against a real biome fixture, cross-checked with source-string
 * inspection of EcosystemOverviewPanel.tsx (for the formula/derivation logic itself, since
 * it is computed internally via `useMemo` and is not exported as a standalone pure
 * function) and VaultPage.tsx (for the dismissal wiring, since dismissal is owned by
 * VaultPage's `overviewDismissed` component state, not the panel itself).
 *
 * Validates: Requirements 3.5, 3.6, 3.7, 3.8
 */

const currentDir = dirname(fileURLToPath(import.meta.url));
const PANEL_SOURCE = readFileSync(join(currentDir, 'EcosystemOverviewPanel.tsx'), 'utf-8');
const VAULT_PAGE_SOURCE = readFileSync(
  join(currentDir, '../../pages/Vault/VaultPage.tsx'),
  'utf-8',
);

// Real biome fixture, reused from the existing test suite's established pattern of testing
// against real `vaults` data (e.g. EcosystemCard.test.ts) rather than hand-rolled fixtures.
const vault = VaultService.getVault('coastal-wetland');
if (!vault) throw new Error('Expected the coastal-wetland vault to exist for this test fixture');
const YEAR = 2026;

describe('EcosystemOverviewPanel health percentage derivation', () => {
  it('matches the design.md formula applied to the given metrics', () => {
    const metrics = { vegetationDensity: 0.62, waterLevel: 0.6, biodiversityLevel: 0.58, developmentLevel: 0.4 };

    // Independently recomputed design.md formula:
    // Math.round(((vegetationDensity + biodiversityLevel + waterLevel + (1 - developmentLevel)) / 4) * 100)
    const expectedHealthPercent = Math.round(
      ((metrics.vegetationDensity + metrics.biodiversityLevel + metrics.waterLevel + (1 - metrics.developmentLevel)) /
        4) *
        100,
    );
    expect(expectedHealthPercent).toBe(60);
    expect(expectedHealthPercent).toBeGreaterThanOrEqual(0);
    expect(expectedHealthPercent).toBeLessThanOrEqual(100);
  });

  it('bounds a healthPercent to [0,100] for both all-zero and all-max metrics', () => {
    const zeroMetrics = { vegetationDensity: 0, waterLevel: 0, biodiversityLevel: 0, developmentLevel: 1 };
    const maxMetrics = { vegetationDensity: 1, waterLevel: 1, biodiversityLevel: 1, developmentLevel: 0 };

    const zeroPercent = Math.round(
      ((zeroMetrics.vegetationDensity + zeroMetrics.biodiversityLevel + zeroMetrics.waterLevel + (1 - zeroMetrics.developmentLevel)) / 4) * 100,
    );
    const maxPercent = Math.round(
      ((maxMetrics.vegetationDensity + maxMetrics.biodiversityLevel + maxMetrics.waterLevel + (1 - maxMetrics.developmentLevel)) / 4) * 100,
    );

    expect(zeroPercent).toBe(0);
    expect(maxPercent).toBe(100);
  });

  it('source computes healthPercent from the exact same four metric fields, unweighted-averaged and rounded (source-level)', () => {
    const startIndex = PANEL_SOURCE.indexOf('const healthPercent');
    expect(startIndex).toBeGreaterThan(-1);
    const endIndex = PANEL_SOURCE.indexOf('[metrics]', startIndex);
    expect(endIndex).toBeGreaterThan(startIndex);
    const block = PANEL_SOURCE.slice(startIndex, endIndex);

    expect(block).toContain('Math.round');
    expect(block).toContain('metrics.vegetationDensity');
    expect(block).toContain('metrics.biodiversityLevel');
    expect(block).toContain('metrics.waterLevel');
    expect(block).toContain('1 - metrics.developmentLevel');
    expect(block).toContain('/');
    expect(block).toContain('4');
    expect(block).toContain('100');
    // No hand-authored per-biome health value is referenced — the formula only reads `metrics`.
    expect(block).not.toContain('biome.health');
  });
});

describe('EcosystemOverviewPanel species count derivation', () => {
  it('matches BiodiversityProfileService.computeProfile(...).totalSpecies for a real biome/year', () => {
    const expectedSpeciesCount = BiodiversityProfileService.computeProfile(vault, YEAR).totalSpecies;
    expect(expectedSpeciesCount).toBeGreaterThan(0);
  });

  it('source wires the exact same computeProfile(biome, year).totalSpecies call (source-level)', () => {
    expect(PANEL_SOURCE).toContain('BiodiversityProfileService.computeProfile(biome, year).totalSpecies');
  });
});

describe('EcosystemOverviewPanel key features derivation (derived from visible objects, capped at 5)', () => {
  it('independently derives the same list the panel would produce: non-null biodiversityCategory, deduped by kind, capped at 5', () => {
    const visibleObjects = vault.objects.filter((o) => o.presentInYears.includes(YEAR));
    // Sanity: the derivation must actually be drawn from real object data, not an
    // independent/hardcoded list — confirm there are more categorized objects available
    // than the cap, so the cap is the thing limiting the list, not data scarcity.
    const categorizedCount = visibleObjects.filter((o) => o.biodiversityCategory !== null).length;
    expect(categorizedCount).toBeGreaterThan(5);

    const seenKinds = new Set<string>();
    const expectedFeatures: string[] = [];
    for (const object of visibleObjects) {
      if (object.biodiversityCategory === null) continue;
      if (seenKinds.has(object.kind)) continue;
      seenKinds.add(object.kind);
      expectedFeatures.push(object.name);
      if (expectedFeatures.length >= 5) break;
    }

    expect(expectedFeatures.length).toBe(5);
    // Every derived feature name must correspond to a real visible object's name —
    // proving the list is derived from, not independent of, the currently-visible objects.
    for (const featureName of expectedFeatures) {
      expect(visibleObjects.some((o) => o.name === featureName)).toBe(true);
    }
  });

  it('source derives keyFeatures from visibleObjects filtered by presentInYears, deduped by kind, capped at MAX_LIST_ITEMS=5 (source-level)', () => {
    expect(PANEL_SOURCE).toContain('const MAX_LIST_ITEMS = 5');
    expect(PANEL_SOURCE).toContain('biome.objects.filter((o) => o.presentInYears.includes(year))');

    const startIndex = PANEL_SOURCE.indexOf('const keyFeatures');
    expect(startIndex).toBeGreaterThan(-1);
    const endIndex = PANEL_SOURCE.indexOf('[visibleObjects]', startIndex);
    expect(endIndex).toBeGreaterThan(startIndex);
    const block = PANEL_SOURCE.slice(startIndex, endIndex);

    // Derived from visibleObjects (the currently-visible objects), not a hardcoded list.
    expect(block).toContain('visibleObjects');
    expect(block).toContain('object.biodiversityCategory === null');
    // Deduplicated by kind.
    expect(block).toContain('seenKinds');
    expect(block).toContain('object.kind');
    // Capped at 5 via MAX_LIST_ITEMS.
    expect(block).toContain('MAX_LIST_ITEMS');
  });
});

describe('EcosystemOverviewPanel main pressures derivation (derived from visible objects, capped at 5)', () => {
  it('independently derives the same deduplicated pressures list, capped at 5', () => {
    const visibleObjects = vault.objects.filter((o) => o.presentInYears.includes(YEAR));
    const allPressures = visibleObjects.flatMap((o) => o.environmentalPressures ?? []);
    expect(allPressures.length).toBeGreaterThan(0);

    const expectedPressures = Array.from(new Set(allPressures)).slice(0, 5);
    expect(expectedPressures.length).toBeGreaterThan(0);
    expect(expectedPressures.length).toBeLessThanOrEqual(5);

    // Every derived pressure must trace back to a real visible object's environmentalPressures —
    // proving derivation from, not independence of, the currently-visible objects.
    for (const pressure of expectedPressures) {
      expect(visibleObjects.some((o) => (o.environmentalPressures ?? []).includes(pressure))).toBe(true);
    }
  });

  it('source derives mainPressures via a deduplicated flatMap over visibleObjects.environmentalPressures, sliced to 5 (source-level)', () => {
    const startIndex = PANEL_SOURCE.indexOf('const mainPressures');
    expect(startIndex).toBeGreaterThan(-1);
    const endIndex = PANEL_SOURCE.indexOf('[visibleObjects]', startIndex);
    expect(endIndex).toBeGreaterThan(startIndex);
    const block = PANEL_SOURCE.slice(startIndex, endIndex);

    expect(block).toContain('new Set(visibleObjects.flatMap((o) => o.environmentalPressures ?? []))');
    expect(block).toContain('.slice(0, MAX_LIST_ITEMS)');
  });
});

describe('EcosystemOverviewPanel onDismiss wiring (source-level)', () => {
  it('wires the dismiss (X) button to the onDismiss prop', () => {
    expect(PANEL_SOURCE).toContain('aria-label="Dismiss ecosystem overview"');
    const dismissButtonIndex = PANEL_SOURCE.indexOf('aria-label="Dismiss ecosystem overview"');
    const nearbyBlock = PANEL_SOURCE.slice(Math.max(0, dismissButtonIndex - 200), dismissButtonIndex + 50);
    expect(nearbyBlock).toContain('onClick={onDismiss}');
  });

  it('wires the "Explore the Vault" primary button to the onDismiss prop as well', () => {
    const exploreButtonIndex = PANEL_SOURCE.indexOf('Explore the Vault');
    expect(exploreButtonIndex).toBeGreaterThan(-1);
    // Find the nearest preceding <button ...> opening tag and confirm onClick={onDismiss}
    // is set within it (attribute order isn't guaranteed, so search the whole tag).
    const buttonTagStart = PANEL_SOURCE.lastIndexOf('<button', exploreButtonIndex);
    expect(buttonTagStart).toBeGreaterThan(-1);
    const buttonTagBlock = PANEL_SOURCE.slice(buttonTagStart, exploreButtonIndex);
    expect(buttonTagBlock).toContain('onClick={onDismiss}');
  });
});

describe('EcosystemOverviewPanel dismissal behavior via VaultPage wiring (source-level)', () => {
  it('starts with overviewDismissed = false', () => {
    expect(VAULT_PAGE_SOURCE).toContain('const [overviewDismissed, setOverviewDismissed] = useState(false)');
  });

  it('sets overviewDismissed to true when the panel is dismissed', () => {
    expect(VAULT_PAGE_SOURCE).toContain('onDismiss={() => setOverviewDismissed(true)}');
  });

  it('renders the panel conditionally on !overviewDismissed, so it hides for the remainder of the session once dismissed', () => {
    expect(VAULT_PAGE_SOURCE).toContain('{!overviewDismissed && (');
    const conditionalIndex = VAULT_PAGE_SOURCE.indexOf('{!overviewDismissed && (');
    const closingIndex = VAULT_PAGE_SOURCE.indexOf('/>', conditionalIndex);
    const block = VAULT_PAGE_SOURCE.slice(conditionalIndex, closingIndex);
    expect(block).toContain('EcosystemOverviewPanel');
  });

  it('resets overviewDismissed to false inside the vault?.ecosystemId-keyed effect, simulating re-entry showing the panel again', () => {
    const effectStart = VAULT_PAGE_SOURCE.indexOf('useEffect(() => {\n    if (!vault) return;');
    expect(effectStart).toBeGreaterThan(-1);
    const effectEnd = VAULT_PAGE_SOURCE.indexOf('[vault?.ecosystemId]', effectStart);
    expect(effectEnd).toBeGreaterThan(effectStart);
    const effectBlock = VAULT_PAGE_SOURCE.slice(effectStart, effectEnd);

    expect(effectBlock).toContain('setOverviewDismissed(false)');
    // Confirm this effect is indeed keyed on the ecosystem id (re-entry trigger).
    expect(VAULT_PAGE_SOURCE.slice(effectEnd, effectEnd + 30)).toContain('[vault?.ecosystemId]');
  });
});
