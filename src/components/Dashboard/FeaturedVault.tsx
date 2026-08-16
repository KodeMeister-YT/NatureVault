import { useNavigate } from 'react-router-dom';
import type { Ecosystem } from '../../types/ecosystem';

export function FeaturedVault({ ecosystem }: { ecosystem: Ecosystem }) {
  const navigate = useNavigate();

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.25em] text-vault-gold">Featured Vault</p>
      <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#0f2318] via-[#1a3324] to-[#294536]">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-60"
          style={{
            backgroundImage:
              'radial-gradient(circle at 20% 30%, rgba(216,184,114,0.12), transparent 45%), radial-gradient(circle at 80% 70%, rgba(74,124,140,0.15), transparent 45%)',
          }}
        />
        <div className="relative grid gap-6 p-8 sm:p-10 md:grid-cols-[1.2fr_1fr] md:items-center">
          <div>
            <h2 className="font-display text-3xl text-vault-offwhite sm:text-4xl">The Forest That Changed</h2>
            <div className="mt-3 flex items-center gap-2 text-sm font-medium text-vault-sage-light">
              <span>1995</span>
              <span aria-hidden="true">→</span>
              <span>2026</span>
              <span aria-hidden="true">→</span>
              <span>2050</span>
            </div>
            <p className="mt-4 max-w-xl text-sm text-vault-offwhite/75 sm:text-base">
              Explore how urban expansion, changing rainfall patterns, and habitat fragmentation can reshape a
              forest ecosystem.
            </p>
            <button
              type="button"
              onClick={() => navigate(`/vault/${ecosystem.id}`)}
              className="mt-6 rounded-full bg-vault-sage px-7 py-3 text-sm font-semibold tracking-wide text-vault-forest-deep transition-transform hover:scale-[1.03] hover:bg-vault-sage-light"
            >
              Enter 3D Vault
            </button>
          </div>
          <div className="relative hidden h-56 items-center justify-center rounded-2xl border border-white/10 bg-black/20 md:flex">
            <div className="flex flex-col items-center gap-2 text-vault-offwhite/50">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 3l3.5 5.5H16l3.5 6H20l1 2.5H3l1-2.5h.5l3.5-6H8L12 3z"
                  stroke="currentColor"
                  strokeWidth="1.2"
                  strokeLinejoin="round"
                />
                <path d="M12 17v4" stroke="currentColor" strokeWidth="1.2" />
              </svg>
              <span className="text-xs">Interactive 3D preview</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
