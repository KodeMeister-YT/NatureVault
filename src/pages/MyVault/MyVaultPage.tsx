import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/Navigation/AppLayout';
import { useAppStore } from '../../store/useAppStore';
import { EcosystemService } from '../../services/EcosystemService';

export function MyVaultPage() {
  const navigate = useNavigate();
  const exploredEcosystems = useAppStore((s) => s.exploredEcosystems);
  const observations = useAppStore((s) => s.observations);
  const conservationActionsLearned = useAppStore((s) => s.conservationActionsLearned);

  const explored = Object.values(exploredEcosystems).filter((e) => e.timesExplored > 0);

  return (
    <AppLayout>
      <section className="mx-auto max-w-4xl px-4 pb-4 pt-12 sm:px-6">
        <h1 className="font-display text-3xl text-vault-offwhite sm:text-4xl">My Vault</h1>
        <p className="mt-2 text-sm text-vault-offwhite/60 sm:text-base">
          Ecosystems you've explored, species you've discovered, and what you've learned along the way.
        </p>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-6 sm:px-6">
        {explored.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-vault-charcoal-soft p-10 text-center">
            <p className="text-vault-offwhite/70">Your environmental archive is empty.</p>
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="mt-4 rounded-full bg-vault-sage px-6 py-2.5 text-sm font-semibold text-vault-forest-deep hover:bg-vault-sage-light"
            >
              Explore your first ecosystem
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {explored.map((entry) => {
              const ecosystem = EcosystemService.getById(entry.ecosystemId);
              if (!ecosystem) return null;
              return (
                <button
                  key={entry.ecosystemId}
                  type="button"
                  onClick={() => navigate(`/vault/${ecosystem.id}`)}
                  className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-vault-charcoal-soft p-5 text-left transition-colors hover:border-white/25"
                >
                  <div>
                    <p className="font-display text-lg text-vault-offwhite">
                      {ecosystem.emoji} {ecosystem.name}
                    </p>
                    <p className="text-sm text-vault-offwhite/60">
                      Explored {entry.timesExplored} {entry.timesExplored === 1 ? 'time' : 'times'} ·{' '}
                      {entry.speciesViewedIds.length} species discovered
                    </p>
                  </div>
                  <span aria-hidden="true" className="text-vault-sage-light">
                    →
                  </span>
                </button>
              );
            })}
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-vault-charcoal-soft p-5 text-center">
            <p className="font-display text-3xl text-vault-sage-light">{explored.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-vault-offwhite/50">Ecosystems explored</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-vault-charcoal-soft p-5 text-center">
            <p className="font-display text-3xl text-vault-sage-light">{observations.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-vault-offwhite/50">Observations logged</p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-vault-charcoal-soft p-5 text-center">
            <p className="font-display text-3xl text-vault-sage-light">{conservationActionsLearned.length}</p>
            <p className="mt-1 text-xs uppercase tracking-wide text-vault-offwhite/50">Actions learned</p>
          </div>
        </div>
      </section>
    </AppLayout>
  );
}
