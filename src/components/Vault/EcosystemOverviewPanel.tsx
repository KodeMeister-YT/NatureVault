import { useMemo } from 'react';
import type { BiomeDefinition, VaultStateMetrics } from '../../types/vault';
import { BiodiversityProfileService, EDUCATIONAL_DATA_DISCLAIMER } from '../../services/BiodiversityProfileService';

interface EcosystemOverviewPanelProps {
  biome: BiomeDefinition;
  year: number;
  metrics: VaultStateMetrics;
  onDismiss: () => void;
}

const MAX_LIST_ITEMS = 5;

export function EcosystemOverviewPanel({ biome, year, metrics, onDismiss }: EcosystemOverviewPanelProps) {
  const healthPercent = useMemo(
    () =>
      Math.round(
        ((metrics.vegetationDensity + metrics.biodiversityLevel + metrics.waterLevel + (1 - metrics.developmentLevel)) /
          4) *
          100,
      ),
    [metrics],
  );

  const indicators = useMemo(
    () => [
      { emoji: '🌿', label: 'Biodiversity', value: metrics.biodiversityLevel },
      { emoji: '🌳', label: 'Habitat', value: (metrics.vegetationDensity + (1 - metrics.developmentLevel)) / 2 },
      { emoji: '💧', label: 'Water', value: metrics.waterLevel },
      { emoji: '🌱', label: 'Vegetation', value: metrics.vegetationDensity },
      { emoji: '🏗️', label: 'Human Pressure', value: metrics.developmentLevel },
    ],
    [metrics],
  );

  const speciesCount = useMemo(
    () => BiodiversityProfileService.computeProfile(biome, year).totalSpecies,
    [biome, year],
  );

  const visibleObjects = useMemo(
    () => biome.objects.filter((o) => o.presentInYears.includes(year)),
    [biome, year],
  );

  const keyFeatures = useMemo(() => {
    const seenKinds = new Set<string>();
    const features: string[] = [];
    for (const object of visibleObjects) {
      if (object.biodiversityCategory === null) continue;
      if (seenKinds.has(object.kind)) continue;
      seenKinds.add(object.kind);
      features.push(object.name);
      if (features.length >= MAX_LIST_ITEMS) break;
    }
    return features;
  }, [visibleObjects]);

  const mainPressures = useMemo(
    () => Array.from(new Set(visibleObjects.flatMap((o) => o.environmentalPressures ?? []))).slice(0, MAX_LIST_ITEMS),
    [visibleObjects],
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="font-display text-2xl text-vault-offwhite">{biome.name}</h2>
            <p className="text-xs text-vault-sage-light">{biome.location}</p>
          </div>
          <button
            type="button"
            onClick={onDismiss}
            aria-label="Dismiss ecosystem overview"
            className="rounded-full border border-white/25 bg-white/10 p-1.5 text-vault-offwhite/90 transition-colors hover:border-white/40 hover:bg-white/20 hover:text-vault-offwhite"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-4 rounded-xl bg-white/5 p-3">
          <div className="flex items-center justify-between">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/60">
              Ecosystem health
            </p>
            <p className="text-sm font-semibold text-vault-offwhite">{healthPercent} / 100</p>
          </div>

          <div className="mt-3 space-y-2">
            {indicators.map((indicator) => {
              const pct = Math.round(Math.min(Math.max(indicator.value, 0), 1) * 100);
              return (
                <div key={indicator.label} className="flex items-center gap-2">
                  <span className="flex w-28 flex-shrink-0 items-center gap-1.5 text-xs text-vault-offwhite/80">
                    <span aria-hidden="true">{indicator.emoji}</span>
                    {indicator.label}
                  </span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/10">
                    <div
                      className={`h-full rounded-full ${
                        indicator.label === 'Human Pressure' ? 'bg-amber-500' : 'bg-vault-sage'
                      }`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="w-9 flex-shrink-0 text-right text-[11px] text-vault-offwhite/60">{pct}%</span>
                </div>
              );
            })}
          </div>

          <p className="mt-2.5 text-[10px] leading-snug text-vault-offwhite/45">
            Educational simulation indicator — not a scientific assessment.
          </p>
        </div>

        <div className="mt-3 rounded-xl bg-white/5 p-3">
          <p className="text-sm text-vault-offwhite/90">{speciesCount} species represented</p>
          <p className="mt-1.5 text-[10px] leading-snug text-vault-offwhite/45">{EDUCATIONAL_DATA_DISCLAIMER}</p>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/60">Key features</p>
            {keyFeatures.length > 0 ? (
              <ul className="mt-1.5 space-y-1 text-xs text-vault-offwhite/80">
                {keyFeatures.map((feature) => (
                  <li key={feature}>{feature}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-vault-offwhite/50">No standout features at this year.</p>
            )}
          </div>

          <div className="rounded-xl bg-white/5 p-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/60">Main pressures</p>
            {mainPressures.length > 0 ? (
              <ul className="mt-1.5 space-y-1 text-xs text-vault-offwhite/80">
                {mainPressures.map((pressure) => (
                  <li key={pressure}>{pressure}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-1.5 text-xs text-vault-offwhite/50">No significant pressures recorded.</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={onDismiss}
          className="mt-4 w-full rounded-full bg-vault-sage px-5 py-2.5 text-sm font-semibold text-vault-forest-deep transition-colors hover:bg-vault-sage-light"
        >
          Explore the Vault
        </button>
      </div>
    </div>
  );
}
