import type { VaultDefinition, VaultStateMetrics } from '../../types/vault';

interface Vault2DFallbackProps {
  vault: VaultDefinition;
  year: number;
  metrics: VaultStateMetrics;
}

const metricLabels: { key: keyof VaultStateMetrics; label: string; emoji: string }[] = [
  { key: 'vegetationDensity', label: 'Vegetation density', emoji: '🌲' },
  { key: 'waterLevel', label: 'Water level', emoji: '💧' },
  { key: 'biodiversityLevel', label: 'Biodiversity', emoji: '🦌' },
  { key: 'developmentLevel', label: 'Development', emoji: '🏗️' },
];

export function Vault2DFallback({ vault, year, metrics }: Vault2DFallbackProps) {
  const yearState = vault.years.find((y) => y.year === year) ?? vault.years[0];
  const objects = vault.objects.filter((o) => o.presentInYears.includes(year));

  return (
    <div className="flex h-full flex-col overflow-y-auto bg-vault-forest-deep p-6 text-vault-offwhite">
      <div className="mx-auto w-full max-w-3xl">
        <div className="rounded-2xl border border-vault-gold/30 bg-vault-gold/10 p-4 text-sm text-vault-gold">
          Your device isn't able to render the full 3D experience. Here's the 2D Vault instead — the timeline and
          environmental comparisons still work.
        </div>

        <h2 className="mt-6 font-display text-2xl">
          {vault.name} · {year}
        </h2>
        <p className="mt-2 text-vault-offwhite/75">{yearState.summary}</p>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {metricLabels.map((m) => (
            <div key={m.key} className="rounded-xl border border-white/10 bg-vault-charcoal-soft p-3 text-center">
              <p className="text-xl" aria-hidden="true">
                {m.emoji}
              </p>
              <p className="mt-1 font-display text-lg text-vault-sage-light">
                {Math.round(metrics[m.key] * 100)}%
              </p>
              <p className="text-[10px] uppercase tracking-wide text-vault-offwhite/50">{m.label}</p>
            </div>
          ))}
        </div>

        <h3 className="mt-8 font-display text-lg">Key changes</h3>
        <ul className="mt-2 space-y-1.5 text-sm text-vault-offwhite/80">
          {yearState.keyChanges.map((c) => (
            <li key={c} className="flex gap-2">
              <span aria-hidden="true" className="text-vault-sage-light">
                •
              </span>
              {c}
            </li>
          ))}
        </ul>

        <h3 className="mt-8 font-display text-lg">Environmental objects present</h3>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
          {objects.map((o) => (
            <div key={o.id} className="rounded-xl border border-white/10 bg-vault-charcoal-soft p-4">
              <p className="font-display text-base">{o.name}</p>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wide text-vault-gold">What you're seeing</p>
              <p className="text-sm text-vault-offwhite/75">{o.description}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-vault-gold">Why it matters</p>
              <p className="text-sm text-vault-offwhite/75">{o.ecologicalRole}</p>
              <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-vault-gold">What changed</p>
              <p className="text-sm text-vault-offwhite/75">{o.historicalChange}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
