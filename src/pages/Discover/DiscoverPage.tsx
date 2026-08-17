import { useMemo, useState } from 'react';
import { AppLayout } from '../../components/Navigation/AppLayout';
import { EcosystemCard } from '../../components/Dashboard/EcosystemCard';
import { FeaturedVault } from '../../components/Dashboard/FeaturedVault';
import { EcosystemService } from '../../services/EcosystemService';
import { filterEcosystems, type ExploreFilterCategory } from './exploreFilters';

const FILTER_CATEGORIES: ExploreFilterCategory[] = [
  'Forest',
  'Wetland',
  'Desert',
  'Mountain',
  'Freshwater',
  'Grassland',
  'Marine',
  'Tropical',
];

export function DiscoverPage() {
  const ecosystems = EcosystemService.getAll();
  const featured = EcosystemService.getFeatured();

  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilters, setActiveFilters] = useState<Set<ExploreFilterCategory>>(new Set());

  const filteredEcosystems = useMemo(
    () => filterEcosystems(ecosystems, searchQuery, activeFilters),
    [ecosystems, searchQuery, activeFilters],
  );

  const toggleFilter = (category: ExploreFilterCategory) => {
    setActiveFilters((previous) => {
      const next = new Set(previous);
      if (next.has(category)) {
        next.delete(category);
      } else {
        next.add(category);
      }
      return next;
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setActiveFilters(new Set());
  };

  return (
    <AppLayout>
      <section className="mx-auto max-w-7xl px-4 pb-4 pt-12 sm:px-6">
        <h1 className="font-display text-3xl text-vault-offwhite sm:text-4xl">
          Explore a living archive of our planet.
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-vault-offwhite/60 sm:text-base">
          Select an ecosystem to step inside its 3D Vault and see how it has changed — and how it could change
          next.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="glass-panel flex flex-col gap-4 rounded-2xl px-4 py-4">
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, location, or description…"
            aria-label="Search ecosystems"
            className="w-full rounded-full border border-white/20 bg-vault-charcoal-soft/60 px-4 py-2 text-sm text-vault-offwhite placeholder:text-vault-offwhite/40 focus:border-vault-sage-light/60 focus:outline-none"
          />
          <div className="flex flex-wrap gap-2">
            {FILTER_CATEGORIES.map((category) => {
              const active = activeFilters.has(category);
              return (
                <button
                  key={category}
                  type="button"
                  onClick={() => toggleFilter(category)}
                  aria-pressed={active}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold tracking-wide transition-colors ${
                    active
                      ? 'bg-vault-sage text-vault-forest-deep'
                      : 'border border-white/20 text-vault-offwhite/80 hover:border-white/40'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        {filteredEcosystems.length === 0 ? (
          <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl px-6 py-16 text-center">
            <p className="text-base text-vault-offwhite">No ecosystems match your search.</p>
            <p className="max-w-sm text-sm text-vault-offwhite/60">
              Try a different search term or clear your active filters to see all ecosystems.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-2 rounded-full bg-vault-sage px-4 py-1.5 text-xs font-semibold tracking-wide text-vault-forest-deep transition-colors hover:bg-vault-sage-light"
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredEcosystems.map((ecosystem) => (
              <EcosystemCard key={ecosystem.id} ecosystem={ecosystem} />
            ))}
          </div>
        )}
      </section>

      <FeaturedVault ecosystem={featured} />
    </AppLayout>
  );
}
