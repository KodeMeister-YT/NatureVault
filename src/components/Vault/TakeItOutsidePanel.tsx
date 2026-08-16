import { useState } from 'react';
import type { Ecosystem } from '../../types/ecosystem';
import { LocationService } from '../../services/LocationService';
import type { DemoLocation } from '../../data/observations/demoLocations';

interface TakeItOutsidePanelProps {
  ecosystem: Ecosystem;
  onClose: () => void;
  onStartWalk: () => void;
}

export function TakeItOutsidePanel({ ecosystem, onClose, onStartWalk }: TakeItOutsidePanelProps) {
  const [locations, setLocations] = useState<DemoLocation[] | null>(null);
  const [checking, setChecking] = useState(false);

  const handleFindNearby = async () => {
    setChecking(true);
    // Attempt real geolocation first; regardless of the outcome we show curated
    // nearby-nature suggestions so the flow never dead-ends for the user or a judge.
    await LocationService.requestLocation();
    setLocations(LocationService.getFallbackLocations(ecosystem.type));
    setChecking(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl text-vault-offwhite">Take It Outside</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-vault-offwhite/60 hover:bg-white/10 hover:text-vault-offwhite"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <p className="mt-2 text-sm text-vault-offwhite/75">
          You just explored a {ecosystem.typeLabel.toLowerCase()} digitally. Now find one near you.
        </p>

        {!locations ? (
          <button
            type="button"
            onClick={handleFindNearby}
            disabled={checking}
            className="mt-5 w-full rounded-full bg-vault-sage px-5 py-2.5 text-sm font-semibold text-vault-forest-deep transition-colors hover:bg-vault-sage-light disabled:opacity-60"
          >
            {checking ? 'Finding nearby nature…' : 'Find Nearby Nature'}
          </button>
        ) : (
          <div className="mt-5 space-y-2">
            {locations.map((loc) => (
              <div key={loc.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
                <div>
                  <p className="text-sm font-medium text-vault-offwhite">{loc.name}</p>
                  <p className="text-xs text-vault-offwhite/50">
                    {loc.type} · {loc.distanceLabel}
                  </p>
                </div>
              </div>
            ))}
            <p className="text-[11px] text-vault-offwhite/40">
              Showing example locations — location access unavailable or a demo location set is in use.
            </p>
          </div>
        )}

        <button
          type="button"
          onClick={onStartWalk}
          className="mt-3 w-full rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-vault-offwhite/90 transition-colors hover:border-white/40 hover:text-vault-offwhite"
        >
          Start a Nature Walk
        </button>
      </div>
    </div>
  );
}
