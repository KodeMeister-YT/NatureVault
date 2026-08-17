/// <reference types="node" />
import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { filterEcosystems } from './exploreFilters';
import { EcosystemService } from '../../services/EcosystemService';

/**
 * `DiscoverPage`'s empty-state rendering and no-navigation-on-filter-change
 * behavior. This project has no `@testing-library/react` (or similar)
 * DOM-render harness installed (see Timeline.test.ts / ScenarioSwitcher.test.ts),
 * so this test exercises the underlying pure `filterEcosystems` logic that
 * `DiscoverPage`'s render is a direct, unconditional function of, plus
 * source-level checks against DiscoverPage.tsx for the empty-state block and
 * the absence of any router navigation call in the search/filter handlers —
 * consistent with how other tests in this codebase verify behavioral
 * invariants via source inspection when rendering isn't available.
 *
 * Validates: Requirements 6.3, 6.5
 */

const currentDir = dirname(fileURLToPath(import.meta.url));
const DISCOVER_PAGE_SOURCE = readFileSync(join(currentDir, 'DiscoverPage.tsx'), 'utf-8');

describe('DiscoverPage empty-state reachability', () => {
  it('filterEcosystems returns an empty array for a guaranteed-non-matching query, proving the empty-state branch is reachable', () => {
    const ecosystems = EcosystemService.getAll();
    expect(ecosystems.length).toBeGreaterThan(0);

    const result = filterEcosystems(ecosystems, 'zzznonexistentquery12345', new Set());
    expect(result).toEqual([]);
  });
});

describe('DiscoverPage empty-state block (source-level)', () => {
  it('renders the empty-state message inside a conditional guarded by filteredEcosystems.length === 0', () => {
    const guardIndex = DISCOVER_PAGE_SOURCE.indexOf('filteredEcosystems.length === 0');
    expect(guardIndex).toBeGreaterThan(-1);

    // The empty-state message should appear after the guard and before the
    // ternary's else-branch (the populated grid), confirming it lives inside
    // the `=== 0` conditional rather than being unconditionally rendered.
    const elseBranchIndex = DISCOVER_PAGE_SOURCE.indexOf(') : (', guardIndex);
    expect(elseBranchIndex).toBeGreaterThan(guardIndex);

    const emptyStateBlock = DISCOVER_PAGE_SOURCE.slice(guardIndex, elseBranchIndex);
    expect(emptyStateBlock).toContain('No ecosystems match your search.');
  });
});

describe('DiscoverPage no-navigation on search input / filter toggle (source-level)', () => {
  it('the search input\'s onChange handler only calls setSearchQuery, never navigate(', () => {
    const onChangeStart = DISCOVER_PAGE_SOURCE.indexOf('onChange={');
    expect(onChangeStart).toBeGreaterThan(-1);

    const exprStart = onChangeStart + 'onChange={'.length;
    const exprEnd = DISCOVER_PAGE_SOURCE.indexOf('}', exprStart);
    expect(exprEnd).toBeGreaterThan(exprStart);

    const onChangeExpr = DISCOVER_PAGE_SOURCE.slice(exprStart, exprEnd);
    expect(onChangeExpr).toContain('setSearchQuery(');
    expect(onChangeExpr).not.toContain('navigate(');
  });

  it('the toggleFilter handler body contains no call to navigate(', () => {
    const fnStart = DISCOVER_PAGE_SOURCE.indexOf('const toggleFilter = (category: ExploreFilterCategory) => {');
    expect(fnStart).toBeGreaterThan(-1);

    // toggleFilter is immediately followed by the clearFilters declaration;
    // slicing up to that boundary captures the full toggleFilter body
    // (including its nested setActiveFilters callback) without needing a
    // brace-matching parser.
    const nextFnStart = DISCOVER_PAGE_SOURCE.indexOf('const clearFilters = ', fnStart);
    expect(nextFnStart).toBeGreaterThan(fnStart);

    const toggleFilterBody = DISCOVER_PAGE_SOURCE.slice(fnStart, nextFnStart);
    expect(toggleFilterBody).toContain('setActiveFilters(');
    expect(toggleFilterBody).not.toContain('navigate(');
  });

  it('DiscoverPage.tsx does not import or use a navigate() call anywhere in its search/filter interaction path', () => {
    // Broad sanity check: useNavigate is not even imported, so no handler in
    // this file could invoke a router navigation as a side effect of typing
    // or toggling a filter.
    expect(DISCOVER_PAGE_SOURCE).not.toContain('useNavigate');
  });
});
