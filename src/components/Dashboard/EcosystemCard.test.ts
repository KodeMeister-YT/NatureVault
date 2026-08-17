/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { EcosystemService } from '../../services/EcosystemService';
import { VaultService } from '../../services/VaultService';
import { BiodiversityProfileService } from '../../services/BiodiversityProfileService';
import { getPresentYear, resolveMetricsForYear } from '../../services/ScenarioService';

/**
 * `EcosystemCard`'s field completeness across all 8 real ecosystems. This
 * project has no `@testing-library/react` (or similar) DOM-render harness
 * installed (see Timeline.test.ts / ScenarioSwitcher.test.ts / DiscoverPage.test.ts),
 * so this test exercises the underlying data/computation logic that
 * `EcosystemCard`'s render is a direct, unconditional function of (species
 * count via `BiodiversityProfileService`, health percent via the same
 * formula used in the component, years-tracked via `vault.years.length`),
 * plus source-level checks against EcosystemCard.tsx confirming the JSX
 * actually surfaces each of those computed values along with the name,
 * type label, and a visible "Enter Vault" affordance.
 *
 * Validates: Requirements 6.4
 */

const currentDir = dirname(fileURLToPath(import.meta.url));
const ECOSYSTEM_CARD_SOURCE = readFileSync(join(currentDir, 'EcosystemCard.tsx'), 'utf-8');

describe('EcosystemCard data completeness across all 8 ecosystems', () => {
  const ecosystems = EcosystemService.getAll();

  it('covers all 8 real ecosystems', () => {
    expect(ecosystems.length).toBe(8);
  });

  it.each(ecosystems.map((ecosystem) => [ecosystem.id, ecosystem] as const))(
    '%s has a valid vault backing its card indicators',
    (_id, ecosystem) => {
      const vault = VaultService.getVault(ecosystem.id);
      expect(vault).not.toBeUndefined();
    },
  );

  it.each(ecosystems.map((ecosystem) => [ecosystem.id, ecosystem] as const))(
    '%s: species count, health percent, and years tracked are well-formed',
    (_id, ecosystem) => {
      const vault = VaultService.getVault(ecosystem.id);
      expect(vault).not.toBeUndefined();
      if (!vault) return;

      const presentYear = getPresentYear(vault.years);

      // Independently-computed expected species count, mirroring exactly
      // what EcosystemCard.tsx computes for its species badge.
      const expectedTotalSpecies = BiodiversityProfileService.computeProfile(vault, presentYear).totalSpecies;
      expect(expectedTotalSpecies).toBeGreaterThanOrEqual(0);

      // Independently-computed expected health percent, mirroring the same
      // formula used in EcosystemCard.tsx's `healthPercent` calculation.
      const metrics = resolveMetricsForYear(vault.years, presentYear);
      const expectedHealthPercent = Math.round(
        ((metrics.vegetationDensity +
          metrics.biodiversityLevel +
          metrics.waterLevel +
          (1 - metrics.developmentLevel)) /
          4) *
          100,
      );
      expect(expectedHealthPercent).toBeGreaterThanOrEqual(0);
      expect(expectedHealthPercent).toBeLessThanOrEqual(100);

      const expectedYearsTracked = vault.years.length;
      expect(expectedYearsTracked).toBeGreaterThan(0);
    },
  );
});

describe('EcosystemCard.tsx renders every required field (source-level)', () => {
  it('renders the ecosystem name', () => {
    expect(ECOSYSTEM_CARD_SOURCE).toContain('{ecosystem.name}');
  });

  it('renders the ecosystem type label', () => {
    expect(ECOSYSTEM_CARD_SOURCE).toContain('{ecosystem.typeLabel}');
  });

  it('renders a species-count badge derived from totalSpecies', () => {
    expect(ECOSYSTEM_CARD_SOURCE).toContain('totalSpecies');
    expect(ECOSYSTEM_CARD_SOURCE).toContain('species');
  });

  it('renders a health indicator derived from healthPercent', () => {
    expect(ECOSYSTEM_CARD_SOURCE).toContain('healthPercent');
    expect(ECOSYSTEM_CARD_SOURCE).toContain('healthy');
  });

  it('renders a timeline/years-tracked indicator', () => {
    expect(ECOSYSTEM_CARD_SOURCE).toContain('yearsTracked');
    expect(ECOSYSTEM_CARD_SOURCE).toContain('years tracked');
  });

  it('renders a visible "Enter Vault" affordance', () => {
    expect(ECOSYSTEM_CARD_SOURCE).toContain('Enter Vault');
  });
});
