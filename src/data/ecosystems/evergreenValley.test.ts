import { describe, expect, it } from 'vitest';
import { evergreenValleyVault } from './evergreenValley';

/**
 * Validates: Requirements 6.3 (river-main -> creek migration)
 *
 * The evergreen valley biome replaced its `river-main` object with a `creek`
 * object (Fernbrook Creek) per design.md's migration note ("needs stream not
 * pond/river"). That note is specifically about the river being narrower/
 * gentler as a creek — it does not forbid the existing small forest pond
 * (`pond-1`) from remaining, so this test only asserts the river is gone and
 * a creek is present, rather than banning ponds outright.
 */
describe('evergreenValleyVault', () => {
  it('has no river object and at least one creek object', () => {
    const riverObjects = evergreenValleyVault.objects.filter((o) => o.kind === 'river');
    const creekObjects = evergreenValleyVault.objects.filter((o) => o.kind === 'creek');

    expect(riverObjects).toHaveLength(0);
    expect(creekObjects.length).toBeGreaterThanOrEqual(1);
  });
});
