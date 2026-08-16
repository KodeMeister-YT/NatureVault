import { AppLayout } from '../../components/Navigation/AppLayout';
import { EcosystemCard } from '../../components/Dashboard/EcosystemCard';
import { FeaturedVault } from '../../components/Dashboard/FeaturedVault';
import { EcosystemService } from '../../services/EcosystemService';

export function DiscoverPage() {
  const ecosystems = EcosystemService.getAll();
  const featured = EcosystemService.getFeatured();

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
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ecosystems.map((ecosystem) => (
            <EcosystemCard key={ecosystem.id} ecosystem={ecosystem} />
          ))}
        </div>
      </section>

      <FeaturedVault ecosystem={featured} />
    </AppLayout>
  );
}
