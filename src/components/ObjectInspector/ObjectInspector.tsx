import type { EnvironmentalObject } from '../../types/vault';
import { biodiversityCategories } from '../../data/biodiversityCategories';

interface ObjectInspectorProps {
  object: EnvironmentalObject;
  year: number;
  onClose: () => void;
  showConnections: boolean;
}

const kindLabel: Record<string, string> = {
  tree: 'Tree',
  plant: 'Plant / Meadow',
  reed: 'Wetland Reed',
  animal: 'Animal',
  frog: 'Amphibian',
  bird: 'Bird',
  pollinator: 'Pollinator',
  fungi: 'Fungi',
  river: 'River Ecosystem',
  pond: 'Pond',
  mountain: 'Mountain',
  rock: 'Rock Formation',
  building: 'Human Structure',
  road: 'Road',
  path: 'Trail',
};

export function ObjectInspector({ object, year, onClose, showConnections }: ObjectInspectorProps) {
  const categoryMeta = object.biodiversityCategory
    ? biodiversityCategories.find((c) => c.id === object.biodiversityCategory)
    : null;

  return (
    <div
      role="dialog"
      aria-label={`${object.name} details`}
      className="glass-panel pointer-events-auto absolute right-4 top-24 z-30 w-[min(92vw,360px)] rounded-2xl p-5 shadow-2xl motion-safe:animate-fade-in-up sm:right-6"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[11px] uppercase tracking-wide text-vault-sage-light">
            {kindLabel[object.kind] ?? object.kind} {categoryMeta ? `· ${categoryMeta.emoji} ${categoryMeta.label}` : ''}
          </p>
          <h3 className="font-display text-xl text-vault-offwhite">{object.name}</h3>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close panel"
          className="rounded-full p-1 text-vault-offwhite/60 transition-colors hover:bg-white/10 hover:text-vault-offwhite"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-4 space-y-4 text-sm">
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-gold">What you're seeing</p>
          <p className="mt-1 text-vault-offwhite/85">{object.description}</p>
        </section>
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-gold">Why it matters</p>
          <p className="mt-1 text-vault-offwhite/85">{object.ecologicalRole}</p>
        </section>
        <section>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-gold">What changed</p>
          <p className="mt-1 text-vault-offwhite/85">{object.historicalChange}</p>
        </section>

        {object.relatedSpecies && object.relatedSpecies.length > 0 && (
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/50">
              Related species
            </p>
            <div className="mt-1.5 flex flex-wrap gap-1.5">
              {object.relatedSpecies.map((s) => (
                <span key={s} className="rounded-full bg-white/10 px-2.5 py-1 text-xs text-vault-offwhite/80">
                  {s}
                </span>
              ))}
            </div>
          </section>
        )}

        {showConnections && object.connection && (
          <section>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/50">
              Ecosystem connections
            </p>
            <div className="mt-2 flex flex-col gap-1">
              {object.connection.chain.map((node, i) => (
                <div key={node} className="flex items-center gap-2">
                  <span className="text-sm text-vault-offwhite/85">{node}</span>
                  {i < object.connection!.chain.length - 1 && (
                    <span aria-hidden="true" className="text-vault-sage-light">
                      ↓
                    </span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}

        <p className="pt-1 text-[11px] text-vault-offwhite/40">Viewing year: {year}</p>
      </div>
    </div>
  );
}
