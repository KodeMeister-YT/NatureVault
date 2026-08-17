import { useNavigate } from 'react-router-dom';
import type { Ecosystem } from '../../types/ecosystem';
import { VaultService } from '../../services/VaultService';
import { BiodiversityProfileService } from '../../services/BiodiversityProfileService';
import { getPresentYear, resolveMetricsForYear } from '../../services/ScenarioService';

const gradientByType: Record<string, string> = {
  'temperate-forest': 'from-[#0f2318] via-[#1a3324] to-[#2c4a34]',
  wetland: 'from-[#0c2226] via-[#173a3d] to-[#2c5459]',
  alpine: 'from-[#111b26] via-[#1f3040] to-[#3a5064]',
  savanna: 'from-[#3a2e14] via-[#7a5e28] to-[#c9a24a]',
  desert: 'from-[#3a2c18] via-[#6b4f2e] to-[#c9a877]',
  'coral-reef': 'from-[#0a2a30] via-[#155a63] to-[#e0765f]',
  lake: 'from-[#0e2230] via-[#1c4356] to-[#4f8fa8]',
  'tropical-forest': 'from-[#12310f] via-[#2c5a1f] to-[#7a9a3f]',
};

/** Green/amber/red banding for the compact health indicator dot. */
function healthBandColor(healthPercent: number): string {
  if (healthPercent >= 66) return 'bg-emerald-400';
  if (healthPercent >= 33) return 'bg-amber-400';
  return 'bg-red-400';
}

export function EcosystemCard({ ecosystem }: { ecosystem: Ecosystem }) {
  const navigate = useNavigate();
  const gradient = gradientByType[ecosystem.type] ?? gradientByType['temperate-forest'];
  const [past, ...rest] = ecosystem.availableYears;
  const future = rest[rest.length - 1];
  const present = rest[0];

  const vault = VaultService.getVault(ecosystem.id);
  let totalSpecies: number | null = null;
  let healthPercent: number | null = null;
  let yearsTracked: number | null = null;
  if (vault) {
    const presentYear = getPresentYear(vault.years);
    totalSpecies = BiodiversityProfileService.computeProfile(vault, presentYear).totalSpecies;
    const metrics = resolveMetricsForYear(vault.years, presentYear);
    healthPercent = Math.round(
      ((metrics.vegetationDensity + metrics.biodiversityLevel + metrics.waterLevel + (1 - metrics.developmentLevel)) /
        4) *
        100,
    );
    yearsTracked = vault.years.length;
  }

  return (
    <button
      type="button"
      onClick={() => navigate(`/vault/${ecosystem.id}`)}
      className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/10 bg-vault-charcoal-soft text-left transition-transform hover:-translate-y-1 focus-visible:-translate-y-1"
    >
      <div className={`relative h-40 w-full bg-gradient-to-br ${gradient}`}>
        <span className="absolute left-4 top-4 text-3xl" aria-hidden="true">
          {ecosystem.emoji}
        </span>
        <div className="absolute inset-0 bg-gradient-to-t from-vault-charcoal-soft via-transparent to-transparent" />
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div>
          <h3 className="font-display text-lg text-vault-offwhite">{ecosystem.name}</h3>
          <div className="flex items-center gap-2">
            <p className="text-sm text-vault-sage-light">{ecosystem.typeLabel}</p>
            {totalSpecies !== null && (
              <span className="rounded-full bg-white/10 px-2 py-0.5 text-[11px] font-medium text-vault-offwhite/70">
                {totalSpecies} species
              </span>
            )}
            {healthPercent !== null && (
              <span
                className="flex items-center gap-1 text-[11px] font-medium text-vault-offwhite/70"
                title={`${healthPercent}% healthy`}
              >
                <span
                  aria-hidden="true"
                  className={`inline-block h-2 w-2 rounded-full ${healthBandColor(healthPercent)}`}
                />
                {healthPercent}% healthy
              </span>
            )}
          </div>
        </div>
        <p className="line-clamp-2 text-sm text-vault-offwhite/60">{ecosystem.description}</p>
        <div className="mt-auto flex items-center gap-2 pt-2 text-xs font-medium text-vault-offwhite/70">
          <span>{past}</span>
          <span aria-hidden="true" className="text-vault-sage-light/60">
            →
          </span>
          <span>{present}</span>
          <span aria-hidden="true" className="text-vault-sage-light/60">
            →
          </span>
          <span>{future}</span>
          {yearsTracked !== null && <span className="text-vault-offwhite/50">{yearsTracked} years tracked</span>}
          <span className="ml-auto flex items-center gap-1 text-vault-sage-light">
            Enter Vault
            <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">
              →
            </span>
          </span>
        </div>
      </div>
    </button>
  );
}
