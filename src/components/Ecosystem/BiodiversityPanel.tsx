import { biodiversityCategories } from '../../data/biodiversityCategories';
import type { BiodiversityCategory } from '../../types/observation';

interface BiodiversityPanelProps {
  activeFilter: BiodiversityCategory | null;
  onSelectFilter: (category: BiodiversityCategory | null) => void;
  connectionsOn: boolean;
  onToggleConnections: () => void;
}

export function BiodiversityPanel({
  activeFilter,
  onSelectFilter,
  connectionsOn,
  onToggleConnections,
}: BiodiversityPanelProps) {
  return (
    <div className="glass-panel pointer-events-auto absolute left-4 top-24 z-30 w-[min(90vw,280px)] rounded-2xl p-4 motion-safe:animate-fade-in-up sm:left-6">
      <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/60">Biodiversity View</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        {biodiversityCategories.map((cat) => {
          const active = activeFilter === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectFilter(active ? null : cat.id)}
              className={`flex items-center gap-2 rounded-xl px-2.5 py-2 text-left text-xs transition-colors ${
                active ? 'bg-vault-sage/25 text-vault-offwhite' : 'text-vault-offwhite/70 hover:bg-white/5'
              }`}
              aria-pressed={active}
            >
              <span aria-hidden="true">{cat.emoji}</span>
              {cat.label}
            </button>
          );
        })}
      </div>
      <label className="mt-3 flex items-center gap-2 border-t border-white/10 pt-3 text-xs text-vault-offwhite/70">
        <input
          type="checkbox"
          checked={connectionsOn}
          onChange={onToggleConnections}
          className="h-3.5 w-3.5 accent-vault-sage"
        />
        Ecosystem Connections
      </label>
    </div>
  );
}
