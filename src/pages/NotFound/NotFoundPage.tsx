import { Link } from 'react-router-dom';
import { AppLayout } from '../../components/Navigation/AppLayout';

export function NotFoundPage() {
  return (
    <AppLayout>
      <section className="mx-auto flex max-w-2xl flex-col items-center px-6 py-24 text-center">
        <h1 className="font-display text-3xl text-vault-offwhite">This trail doesn't exist yet.</h1>
        <p className="mt-3 text-vault-offwhite/60">
          The page you're looking for isn't part of the archive. Let's head back to familiar ground.
        </p>
        <Link
          to="/discover"
          className="mt-6 rounded-full bg-vault-sage px-6 py-2.5 text-sm font-semibold text-vault-forest-deep hover:bg-vault-sage-light"
        >
          Back to Discover
        </Link>
      </section>
    </AppLayout>
  );
}
