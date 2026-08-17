import { scenarios } from '../../data/scenarios';
import { getPresentYear, resolveMetricsForYear } from '../../services/ScenarioService';
import type { VaultYearState } from '../../types/vault';

interface ScenarioSwitcherProps {
  activeScenarioId: string;
  onChange: (id: string) => void;
  years: VaultYearState[];
  year: number;
}

/**
 * Compares the "Continue as Is" and "Protect & Restore" scenarios' resolved
 * biodiversityLevel at the same projected year, deriving a percentage-point
 * delta purely from resolveMetricsForYear outputs (no hand-authored constant).
 * Returns null when `projectedYear` isn't actually a projected year.
 *
 * Validates: Requirements 5.4, 5.5
 */
export function computeScenarioImpactSummary(
  years: VaultYearState[],
  projectedYear: number,
): { deltaPercent: number; label: string } | null {
  if (years.length === 0) return null;
  const presentYear = getPresentYear(years);
  if (projectedYear <= presentYear) return null;

  const continueMetrics = resolveMetricsForYear(years, projectedYear, 'continue-as-is');
  const protectMetrics = resolveMetricsForYear(years, projectedYear, 'protect-and-restore');
  const deltaPercent = Math.round((protectMetrics.biodiversityLevel - continueMetrics.biodiversityLevel) * 100);
  return {
    deltaPercent,
    label: `${deltaPercent >= 0 ? '+' : ''}${deltaPercent}% represented biodiversity under Protect & Restore`,
  };
}

export function ScenarioSwitcher({ activeScenarioId, onChange, years, year }: ScenarioSwitcherProps) {
  const impactSummary = computeScenarioImpactSummary(years, year);

  return (
    <div className="glass-panel flex flex-col gap-2 rounded-2xl px-4 py-3">
      <p className="text-[10px] uppercase tracking-wide text-vault-offwhite/50">
        Scenario visualization — not a scientific forecast.
      </p>
      <div className="flex gap-2">
        {scenarios.map((scenario) => {
          const active = scenario.id === activeScenarioId;
          return (
            <button
              key={scenario.id}
              type="button"
              onClick={() => onChange(scenario.id)}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                active
                  ? scenario.id === 'protect-and-restore'
                    ? 'bg-vault-sage text-vault-forest-deep'
                    : 'bg-vault-earth text-vault-charcoal'
                  : 'border border-white/20 text-vault-offwhite/80 hover:border-white/40'
              }`}
            >
              {scenario.name === 'Continue as Is' ? 'CONTINUE AS IS' : 'PROTECT & RESTORE'}
            </button>
          );
        })}
      </div>
      {impactSummary && (
        <div className="flex flex-col gap-0.5 border-t border-white/10 pt-2">
          <p className="text-xs font-semibold text-vault-offwhite">{impactSummary.label}</p>
          <p className="text-[10px] uppercase tracking-wide text-vault-offwhite/50">
            Illustrative simulation — not a scientific forecast
          </p>
        </div>
      )}
    </div>
  );
}
