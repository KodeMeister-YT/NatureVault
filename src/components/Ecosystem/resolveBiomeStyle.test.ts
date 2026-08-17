import { describe, expect, it } from 'vitest';
import fc from 'fast-check';
import { resolveBiomeStyle } from './resolveBiomeStyle';
import type { BiomeStyle, BiomeStyleEntry } from '../../types/biome';

const KINDS = ['tree', 'canopyTree', 'rock', 'reed', 'plant', 'pollinator'] as const;
const VARIANTS = ['conifer', 'broadleaf', 'tallGrass', 'kelp'] as const;

const entryArb: fc.Arbitrary<BiomeStyleEntry> = fc.record({
  kind: fc.constantFrom(...KINDS),
  variant: fc.option(fc.constantFrom(...VARIANTS), { nil: undefined }),
  colorPrimary: fc.option(fc.constantFrom('#2f5a3a', '#7a7568', '#c9b23c', '#6f8f4a', '#e0a83c'), { nil: undefined }),
  colorAccent: fc.option(fc.constantFrom('#8fd18a', '#a8a396', '#e0c96f', '#c7d98a', '#ffd76a'), { nil: undefined }),
});

/** De-dupes entries by (kind, variant) so the fixture matches resolveBiomeStyle's documented precondition. */
function dedupeEntries(entries: BiomeStyleEntry[]): BiomeStyleEntry[] {
  const seen = new Set<string>();
  const result: BiomeStyleEntry[] = [];
  for (const entry of entries) {
    const key = `${entry.kind}::${entry.variant ?? ''}`;
    if (seen.has(key)) continue;
    seen.add(key);
    result.push(entry);
  }
  return result;
}

const styleArb: fc.Arbitrary<BiomeStyle> = fc
  .array(entryArb, { maxLength: 12 })
  .map((entries) => ({ entries: dedupeEntries(entries) }));

/**
 * Validates: Requirements 1.1, 1.2 (Property 3 in design.md — BiomeStyle resolution correctness)
 */
describe('resolveBiomeStyle (Property 3)', () => {
  it('returned entry, when defined, always has a kind matching the query', () => {
    fc.assert(
      fc.property(styleArb, fc.constantFrom(...KINDS), fc.option(fc.constantFrom(...VARIANTS), { nil: undefined }), (style, kind, variant) => {
        const result = resolveBiomeStyle(style, kind, variant);
        if (result) {
          expect(result.kind).toBe(kind);
        }
      }),
    );
  });

  it('a variant-specific entry always wins over a kind-only entry when both exist', () => {
    fc.assert(
      fc.property(styleArb, fc.constantFrom(...KINDS), fc.constantFrom(...VARIANTS), (style, kind, variant) => {
        const variantEntry = style.entries.find((e) => e.kind === kind && e.variant === variant);
        const kindOnlyEntry = style.entries.find((e) => e.kind === kind && !e.variant);

        const result = resolveBiomeStyle(style, kind, variant);

        if (variantEntry) {
          expect(result).toBe(variantEntry);
        } else if (kindOnlyEntry) {
          expect(result).toBe(kindOnlyEntry);
        } else {
          expect(result).toBeUndefined();
        }
      }),
    );
  });
});
