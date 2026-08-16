import type { ReactNode } from 'react';
import { Navigation } from './Navigation';

export function AppLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-vault-charcoal text-vault-offwhite">
      <Navigation />
      <main>{children}</main>
    </div>
  );
}
