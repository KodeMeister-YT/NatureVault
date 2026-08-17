import type { BiomeStyle, BiomeStyleEntry } from '../../types/biome';
import type { ObjectKind } from '../../types/vault';

/**
 * Resolves the `BiomeStyleEntry` (if any) a rendered object should use for its
 * color/variant treatment. A variant-specific entry always wins over a
 * kind-only entry when both exist for the same `kind`; returns `undefined`
 * when the biome declares no override for this kind/variant combination.
 *
 * See .kiro/specs/visual-qa-polish-pass/design.md, "Components and Interfaces" #1.
 */
export function resolveBiomeStyle(style: BiomeStyle, kind: ObjectKind, variant?: string): BiomeStyleEntry | undefined {
  if (variant) {
    const exact = style.entries.find((e) => e.kind === kind && e.variant === variant);
    if (exact) return exact;
  }
  return style.entries.find((e) => e.kind === kind && !e.variant);
}
