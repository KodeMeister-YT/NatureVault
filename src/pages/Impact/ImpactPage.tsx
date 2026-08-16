import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/Navigation/AppLayout';
import { useAppStore } from '../../store/useAppStore';
import { EcosystemService } from '../../services/EcosystemService';
import { getActionsForType } from '../../data/observations/conservationActions';
import type { EcosystemType } from '../../types/ecosystem';

export function ImpactPage() {
  const navigate = useNavigate();
  const exploredEcosystems = useAppStore((s) => s.exploredEcosystems);
  const observations = useAppStore((s) => s.observations);
  const conservationActionsLearned = useAppStore((s) => s.conservationActionsLearned);
  const markConservationActionLearned = useAppStore((s) => s.markConservationActionLearned);

  const exploredList = Object.values(exploredEcosystems).filter((e) => e.timesExplored > 0);
  const speciesDiscovered = new Set(exploredList.flatMap((e) => e.speciesViewedIds)).size;

  const exploredTypes = Array.from(
    new Set(
      exploredList
        .map((e) => EcosystemService.getById(e.ecosystemId)?.type)
        .filter((t): t is EcosystemType => Boolean(t)),
    ),
  );

  const hasActivity = exploredList.length > 0;

  return (
    <AppLayout>
      <section className="mx-auto max-w-4xl px-4 pb-4 pt-12 sm:px-6">
        <h1 className="font-display text-3xl text-vault-offwhite sm:text-4xl">Your Exploration</h1>
        <p className="mt-2 text-sm text-vault-offwhite/60 sm:text-base">
          NatureVault measures engagement and learning — not unverifiable environmental claims.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {!hasActivity ? (
          <div className="rounded-2xl border border-white/10 bg-vault-charcoal-soft p-10 text-center">
            <p className="text-vault-offwhite/70">You haven't explored any ecosystems yet.</p>
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="mt-4 rounded-full bg-vault-sage px-6 py-2.5 text-sm font-semibold text-vault-forest-deep hover:bg-vault-sage-light"
            >
              Explore your first ecosystem
            </button>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <StatCard value={exploredList.length} label="Ecosystems explored" />
              <StatCard value={observations.length} label="Observations" />
              <StatCard value={speciesDiscovered} label="Species discovered" />
              <StatCard value={conservationActionsLearned.length} label="Actions learned" />
            </div>

            <div className="mt-10">
              <h2 className="font-display text-2xl text-vault-offwhite">What You Can Do Next</h2>
              <p className="mt-2 text-sm text-vault-offwhite/60">
                Practical, non-judgmental suggestions based on what you've explored.
              </p>

              <div className="mt-5 space-y-6">
                {exploredTypes.map((type) => {
                  const ecosystem = EcosystemService.getAll().find((e) => e.type === type);
                  const actions = getActionsForType(type);
                  return (
                    <div key={type} className="rounded-2xl border border-white/10 bg-vault-charcoal-soft p-5">
                      <p className="text-sm text-vault-offwhite/70">
                        You explored a {ecosystem?.typeLabel.toLowerCase() ?? type} ecosystem.
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-vault-offwhite/50">
                        Consider:
                      </p>
                      <ul className="mt-2 space-y-2">
                        {actions.map((action) => {
                          const learned = conservationActionsLearned.includes(action.id);
                          return (
                            <li key={action.id} className="flex items-center justify-between gap-3">
                              <span className="text-sm text-vault-offwhite/85">{action.action}</span>
                              <button
                                type="button"
                                onClick={() => markConservationActionLearned(action.id)}
                                disabled={learned}
                                className={`shrink-0 rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                                  learned
                                    ? 'bg-vault-sage/20 text-vault-sage-light'
                                    : 'border border-white/15 text-vault-offwhite/70 hover:border-white/40'
                                }`}
                              >
                                {learned ? 'Learned ✓' : 'Mark as learned'}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          </>
        )}
      </section>
    </AppLayout>
  );
}

function StatCard({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-vault-charcoal-soft p-5 text-center">
      <p className="font-display text-3xl text-vault-sage-light">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-wide text-vault-offwhite/50">{label}</p>
    </div>
  );
}
