import { scenarios } from '../../data/scenarios';

interface ScenarioSwitcherProps {
  activeScenarioId: string;
  onChange: (id: string) => void;
}

export function ScenarioSwitcher({ activeScenarioId, onChange }: ScenarioSwitcherProps) {
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
    </div>
  );
}
