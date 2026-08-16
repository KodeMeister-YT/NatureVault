import { useNavigate } from 'react-router-dom';
import { AppLayout } from '../../components/Navigation/AppLayout';
import { EcosystemService } from '../../services/EcosystemService';
import { VaultService } from '../../services/VaultService';

export function ArchivePage() {
  const navigate = useNavigate();
  const ecosystems = EcosystemService.getAll();

  return (
    <AppLayout>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-12 sm:px-6">
        <h1 className="font-display text-3xl text-vault-offwhite sm:text-4xl">Environmental Memory</h1>
        <p className="mt-2 max-w-2xl text-sm text-vault-offwhite/60 sm:text-base">
          Saved environmental snapshots across every ecosystem in the archive — their history, biodiversity, and
          the conservation opportunities they represent.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {ecosystems.length === 0 ? (
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
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {ecosystems.map((ecosystem) => {
              const vault = VaultService.getVault(ecosystem.id);
              const keyChanges = vault?.years[vault.years.length - 1]?.keyChanges ?? [];
              return (
                <div
                  key={ecosystem.id}
                  className="rounded-2xl border border-white/10 bg-vault-charcoal-soft p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="font-display text-xl text-vault-offwhite">
                        {ecosystem.emoji} {ecosystem.name}
                      </h2>
                      <p className="text-sm text-vault-sage-light">{ecosystem.typeLabel}</p>
                      <p className="mt-1 text-xs text-vault-offwhite/50">{ecosystem.location}</p>
                    </div>
                    <div className="flex flex-col items-end gap-1 text-xs text-vault-offwhite/70">
                      {ecosystem.availableYears.map((y) => (
                        <span key={y}>{y}</span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    {ecosystem.environmentalIndicators.map((ind) => (
                      <div key={ind.label} className="rounded-lg bg-black/20 p-2 text-center">
                        <p className="text-[10px] uppercase tracking-wide text-vault-offwhite/50">{ind.label}</p>
                        <p className="mt-1 font-display text-lg text-vault-sage-light">
                          {ind.value}
                          {ind.unit}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <p className="text-xs font-semibold uppercase tracking-wide text-vault-offwhite/50">
                      Key changes
                    </p>
                    <ul className="mt-2 space-y-1 text-sm text-vault-offwhite/70">
                      {keyChanges.slice(0, 3).map((change) => (
                        <li key={change} className="flex gap-2">
                          <span aria-hidden="true" className="text-vault-sage-light">
                            •
                          </span>
                          {change}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => navigate(`/vault/${ecosystem.id}`)}
                    className="mt-5 rounded-full border border-white/15 px-5 py-2 text-sm font-medium text-vault-offwhite/90 transition-colors hover:border-white/40 hover:text-vault-offwhite"
                  >
                    Enter 3D Vault
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </AppLayout>
  );
}
