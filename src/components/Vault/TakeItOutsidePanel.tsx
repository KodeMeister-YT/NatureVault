import { useState } from 'react';
import type { Ecosystem } from '../../types/ecosystem';
import { LocationService, type LocationResult } from '../../services/LocationService';
import type { DemoLocation } from '../../data/observations/demoLocations';
import { LocationSelector } from './LocationSelector';

interface TakeItOutsidePanelProps {
  ecosystem: Ecosystem;
  onClose: () => void;
  onStartWalk: () => void;
}

type PanelState = 'idle' | 'resolving' | 'resolved' | 'unresolved';

export function TakeItOutsidePanel({ ecosystem, onClose, onStartWalk }: TakeItOutsidePanelProps) {
  const [state, setState] = useState<PanelState>('idle');
  const [result, setResult] = useState<LocationResult | null>(null);
  const [showDemoLocations, setShowDemoLocations] = useState(false);

  const demoLocations: DemoLocation[] = LocationService.getFallbackLocations(ecosystem.type);

  const runResolveLocation = async () => {
    setState('resolving');
    const resolved = await LocationService.resolveLocation();
    setResult(resolved);
    setState(resolved.status === 'resolved' || resolved.status === 'geocode-failed' ? 'resolved' : 'unresolved');
  };

  const handleFindNearby = () => {
    void runResolveLocation();
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

        {state === 'idle' && (
          <button
            type="button"
            onClick={handleFindNearby}
            className="mt-5 w-full rounded-full bg-vault-sage px-5 py-2.5 text-sm font-semibold text-vault-forest-deep transition-colors hover:bg-vault-sage-light"
          >
            Find Nearby Nature
          </button>
        )}

        {state === 'resolving' && (
          <button
            type="button"
            disabled
            className="mt-5 w-full rounded-full bg-vault-sage px-5 py-2.5 text-sm font-semibold text-vault-forest-deep opacity-60"
          >
            Finding nearby nature…
          </button>
        )}

        {state === 'resolved' && result && result.status !== 'unavailable' && result.status !== 'denied' && (
          <div className="mt-5 space-y-3">
            {result.status === 'resolved' ? (
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm font-medium text-vault-offwhite">
                  {result.city ? `Near ${result.city}${result.region ? `, ${result.region}` : ''}` : 'Location found'}
                </p>
                <a
                  href={result.mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded-full bg-vault-sage/20 px-3.5 py-1.5 text-xs font-semibold text-vault-sage-light hover:bg-vault-sage/30"
                >
                  Search nearby parks & trails
                </a>
              </div>
            ) : (
              <div className="rounded-xl border border-white/10 bg-black/20 p-3">
                <p className="text-sm font-medium text-vault-offwhite">Location found, but we couldn't identify the city name</p>
                <a
                  href={result.mapsSearchUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-block rounded-full bg-vault-sage/20 px-3.5 py-1.5 text-xs font-semibold text-vault-sage-light hover:bg-vault-sage/30"
                >
                  Search nearby parks & trails anyway
                </a>
              </div>
            )}

            {result.status === 'resolved' && result.isWithinDemoRegion && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/50">
                  Example Portland-area locations
                </p>
                {demoLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
                    <div>
                      <p className="text-sm font-medium text-vault-offwhite">{loc.name}</p>
                      <p className="text-xs text-vault-offwhite/50">
                        {loc.type} · {loc.distanceLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {state === 'unresolved' && (
          <>
            <LocationSelector
              onDemoModeSelected={() => setShowDemoLocations(true)}
              onRetryLocation={() => {
                LocationService.clearCache();
                void runResolveLocation();
              }}
            />
            {showDemoLocations && (
              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/50">
                  Example Portland-area locations (demo data — not based on your location)
                </p>
                {demoLocations.map((loc) => (
                  <div key={loc.id} className="flex items-center justify-between rounded-xl border border-white/10 bg-black/20 p-3">
                    <div>
                      <p className="text-sm font-medium text-vault-offwhite">{loc.name}</p>
                      <p className="text-xs text-vault-offwhite/50">
                        {loc.type} · {loc.distanceLabel}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
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
