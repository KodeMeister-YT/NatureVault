/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { regions } from '../../data/observations/regionLocations';

/**
 * `TakeItOutsidePanel`'s exact required copy strings (idle/resolved/unresolved
 * states) and its demo-location-card field completeness. This project has no
 * `@testing-library/react` (or similar) DOM-render harness installed (see
 * ScenarioSwitcher.test.ts / EcosystemCard.test.ts / DiscoverPage.test.ts), so
 * this test follows the same established pattern: source-string inspection of
 * TakeItOutsidePanel.tsx for the literal copy and JSX field bindings, plus
 * exercising the real `regionLocations` dataset (which every demo card is
 * rendered from) to independently confirm every field the card is supposed to
 * bind against is actually populated.
 *
 * Validates: Requirements 7.4, 7.5, 7.6, 7.7
 */

const currentDir = dirname(fileURLToPath(import.meta.url));
const PANEL_SOURCE = readFileSync(join(currentDir, 'TakeItOutsidePanel.tsx'), 'utf-8');

describe('TakeItOutsidePanel exact required copy strings', () => {
  it('renders "TAKE IT OUTSIDE" as the panel title', () => {
    expect(PANEL_SOURCE).toContain('TAKE IT OUTSIDE');
  });

  it('renders the required introductory copy', () => {
    expect(PANEL_SOURCE).toContain(
      'You explored this ecosystem digitally. Now find something similar in the real world.',
    );
  });

  it('renders "Nearby Nature — Based on your location" as the resolved-section heading', () => {
    expect(PANEL_SOURCE).toContain('Nearby Nature — Based on your location');
  });

  it('renders "We couldn\'t access your location." for the denied/unavailable (unresolved) state', () => {
    expect(PANEL_SOURCE).toContain("We couldn't access your location.");
  });

  it('renders the "Choose Location" flow (LocationSelector) in the unresolved state', () => {
    const unresolvedBlockStart = PANEL_SOURCE.indexOf("state === 'unresolved'");
    expect(unresolvedBlockStart).toBeGreaterThan(-1);
    const unresolvedBlockEnd = PANEL_SOURCE.indexOf('</>', unresolvedBlockStart);
    expect(unresolvedBlockEnd).toBeGreaterThan(unresolvedBlockStart);
    const block = PANEL_SOURCE.slice(unresolvedBlockStart, unresolvedBlockEnd);
    expect(block).toContain("We couldn't access your location.");
    expect(block).toContain('<LocationSelector');
  });

  it('places the title unconditionally (idle state copy always renders)', () => {
    const titleIndex = PANEL_SOURCE.indexOf('TAKE IT OUTSIDE');
    const introIndex = PANEL_SOURCE.indexOf(
      'You explored this ecosystem digitally. Now find something similar in the real world.',
    );
    const firstStateGuardIndex = PANEL_SOURCE.indexOf("state === 'idle'");
    expect(titleIndex).toBeLessThan(firstStateGuardIndex);
    expect(introIndex).toBeLessThan(firstStateGuardIndex);
  });
});

describe('TakeItOutsidePanel demo location card renders every required field (source-level)', () => {
  it('renders a visible "Demo location" tag', () => {
    expect(PANEL_SOURCE).toContain('Demo location');
  });

  it('renders the location name', () => {
    expect(PANEL_SOURCE).toContain('{loc.name}');
  });

  it('renders the location type', () => {
    expect(PANEL_SOURCE).toContain('{loc.type}');
  });

  it('renders the distance label (real distance, or "Distance unknown" for demo-only entries)', () => {
    expect(PANEL_SOURCE).toContain('{loc.distanceLabel}');
  });

  it('renders the location description', () => {
    expect(PANEL_SOURCE).toContain('{loc.description}');
  });

  it('renders an Explore action wired to buildExploreUrl', () => {
    expect(PANEL_SOURCE).toContain('buildExploreUrl(loc');
    expect(PANEL_SOURCE).toContain('Explore');
  });

  it('renders a Directions action wired to buildDirectionsUrl', () => {
    expect(PANEL_SOURCE).toContain('buildDirectionsUrl(loc');
    expect(PANEL_SOURCE).toContain('Directions');
  });

  it('renders both actions inside the same card-rendering function', () => {
    const cardFnStart = PANEL_SOURCE.indexOf('renderDemoLocationCard');
    expect(cardFnStart).toBeGreaterThan(-1);
    const cardFnEnd = PANEL_SOURCE.indexOf('\n  );', cardFnStart);
    expect(cardFnEnd).toBeGreaterThan(cardFnStart);
    const cardFnBody = PANEL_SOURCE.slice(cardFnStart, cardFnEnd);

    expect(cardFnBody).toContain('Demo location');
    expect(cardFnBody).toContain('{loc.name}');
    expect(cardFnBody).toContain('{loc.type}');
    expect(cardFnBody).toContain('{loc.distanceLabel}');
    expect(cardFnBody).toContain('{loc.description}');
    expect(cardFnBody).toContain('buildExploreUrl(loc');
    expect(cardFnBody).toContain('buildDirectionsUrl(loc');
  });
});

describe('TakeItOutsidePanel demo cards are backed by fully-populated DemoLocation data', () => {
  // Every demo card the panel renders comes from `regionLocations.ts`'s
  // `DemoLocation` entries (via LocationService.getFallbackLocations). This
  // independently confirms the fields the card binds against (name, type,
  // distanceLabel, description) are non-empty for every real region/location
  // the panel could ever render, complementing the source-level JSX checks
  // above (which confirm the binding exists) with data-level coverage
  // (confirming the bound values are always meaningful).
  it('every region has at least one location with all required card fields populated', () => {
    expect(regions.length).toBeGreaterThan(0);
    for (const region of regions) {
      expect(region.locations.length).toBeGreaterThan(0);
      for (const location of region.locations) {
        expect(location.name.length).toBeGreaterThan(0);
        expect(location.type.length).toBeGreaterThan(0);
        expect(location.distanceLabel.length).toBeGreaterThan(0);
        expect(location.description.length).toBeGreaterThan(0);
      }
    }
  });

  it('uses "Distance unknown" as the distanceLabel for demo-only entries lacking a real user distance', () => {
    const allDistanceLabels = regions.flatMap((region) => region.locations.map((loc) => loc.distanceLabel));
    expect(allDistanceLabels.every((label) => label === 'Distance unknown')).toBe(true);
  });
});
