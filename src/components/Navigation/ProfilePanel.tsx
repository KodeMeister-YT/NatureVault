import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { EcosystemService } from '../../services/EcosystemService';

interface ProfilePanelProps {
  onClose: () => void;
}

export function ProfilePanel({ onClose }: ProfilePanelProps) {
  const navigate = useNavigate();
  const panelRef = useRef<HTMLDivElement>(null);
  const exploredEcosystems = useAppStore((s) => s.exploredEcosystems);
  const observations = useAppStore((s) => s.observations);

  const explored = Object.values(exploredEcosystems).filter((e) => e.timesExplored > 0);
  const speciesDiscovered = new Set(explored.flatMap((e) => e.speciesViewedIds)).size;
  // A light, non-scientific "explorer level" derived from engagement, purely for a sense of progress.
  const explorerLevel = Math.max(1, Math.min(20, Math.floor((explored.length * 2 + observations.length) / 3) + 1));

  // Close on outside click and Escape.
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('mousedown', handleClick);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end bg-black/40 px-4 pt-16 sm:px-6">
      <div
        ref={panelRef}
        role="dialog"
        aria-label="My Nature Profile"
        className="glass-panel w-full max-w-sm rounded-2xl p-6 motion-safe:animate-fade-in-up"
      >
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl text-vault-offwhite">My Nature Profile</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close profile"
            className="rounded-full p-1 text-vault-offwhite/60 transition-colors hover:bg-white/10 hover:text-vault-offwhite"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-vault-sage/20 text-vault-sage-light">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
              <path d="M4 20c0-3.5 3.6-6 8-6s8 2.5 8 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <div>
            <p className="text-xs uppercase tracking-wide text-vault-offwhite/50">Explorer Level</p>
            <p className="font-display text-2xl text-vault-gold">{explorerLevel}</p>
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-vault-offwhite/50">Exploration</p>
          <div className="mt-2 grid grid-cols-3 gap-2">
            <StatBlock value={explored.length} label="ecosystems explored" />
            <StatBlock value={observations.length} label="observations" />
            <StatBlock value={speciesDiscovered} label="species discovered" />
          </div>
        </div>

        <div className="mt-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-vault-offwhite/50">Recently Explored</p>
          {explored.length === 0 ? (
            <p className="mt-2 text-sm text-vault-offwhite/60">
              You haven't explored any ecosystems yet.
            </p>
          ) : (
            <div className="mt-2 space-y-1.5">
              {explored.map((entry) => {
                const ecosystem = EcosystemService.getById(entry.ecosystemId);
                if (!ecosystem) return null;
                return (
                  <button
                    key={entry.ecosystemId}
                    type="button"
                    onClick={() => {
                      onClose();
                      navigate(`/vault/${ecosystem.id}`);
                    }}
                    className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm text-vault-offwhite/85 transition-colors hover:bg-white/5"
                  >
                    <span>
                      {ecosystem.emoji} {ecosystem.name}
                    </span>
                    <span aria-hidden="true" className="text-vault-sage-light">
                      →
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={onClose}
          className="mt-6 w-full rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-vault-offwhite/85 transition-colors hover:border-white/40 hover:text-vault-offwhite"
        >
          Close
        </button>
      </div>
    </div>
  );
}

function StatBlock({ value, label }: { value: number; label: string }) {
  return (
    <div className="rounded-lg bg-black/20 p-2.5 text-center">
      <p className="font-display text-lg text-vault-sage-light">{value}</p>
      <p className="mt-0.5 text-[10px] leading-tight text-vault-offwhite/50">{label}</p>
    </div>
  );
}
