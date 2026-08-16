import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { ProfilePanel } from './ProfilePanel';

const navLinks = [
  { to: '/discover', label: 'Discover' },
  { to: '/my-vault', label: 'My Vaults' },
  { to: '/archive', label: 'Explore' },
  { to: '/impact', label: 'Impact' },
  { to: '/about', label: 'About' },
];

export function Navigation() {
  const navigate = useNavigate();
  const isDemoMode = useAppStore((s) => s.isDemoMode);
  const startDemoMode = useAppStore((s) => s.startDemoMode);
  const exitDemoMode = useAppStore((s) => s.exitDemoMode);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-vault-charcoal/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <div className="flex items-center gap-8">
          <NavLink to="/discover" className="font-display text-lg tracking-wide text-vault-offwhite">
            NatureVault
          </NavLink>
          <nav className="hidden items-center gap-6 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `text-sm transition-colors ${
                    isActive ? 'text-vault-offwhite' : 'text-vault-sage-light/80 hover:text-vault-offwhite'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          {isDemoMode && (
            <span className="hidden rounded-full border border-vault-gold/40 bg-vault-gold/10 px-3 py-1 text-xs font-medium tracking-wide text-vault-gold sm:inline-block">
              DEMO MODE
            </span>
          )}
          {isDemoMode ? (
            <button
              type="button"
              onClick={() => {
                exitDemoMode();
                navigate('/');
              }}
              className="rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-vault-offwhite/80 transition-colors hover:border-white/40 hover:text-vault-offwhite"
            >
              Exit Demo
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                startDemoMode();
                navigate('/discover');
              }}
              className="rounded-full bg-vault-sage/90 px-4 py-1.5 text-xs font-semibold tracking-wide text-vault-forest-deep transition-colors hover:bg-vault-sage"
            >
              Demo Mode
            </button>
          )}
          <button
            type="button"
            aria-label="Profile"
            aria-haspopup="dialog"
            aria-expanded={isProfileOpen}
            onClick={() => setIsProfileOpen(true)}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-white/15 text-vault-offwhite/80 transition-colors hover:border-white/40 hover:text-vault-offwhite"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </button>
        </div>
      </div>
      {isProfileOpen && <ProfilePanel onClose={() => setIsProfileOpen(false)} />}
    </header>
  );
}
