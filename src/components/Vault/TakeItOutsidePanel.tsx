import { useState } from 'react';
import type { Ecosystem } from '../../types/ecosystem';
import { LocationService, type LocationResult } from '../../services/LocationService';
import type { DemoLocation } from '../../data/observations/regionLocations';
import { LocationSelector } from './LocationSelector';

interface TakeItOutsidePanelProps {
  ecosystem: Ecosystem;
  onClose: () => void;
  onStartWalk: () => void;
}

type PanelState = 'idle' | 'resolving' | 'resolved' | 'unresolved';

interface Coords {
  latitude: number;
  longitude: number;
}

/** Explore action: prefer the location's own deep link, else a maps search scoped to known coordinates (if any). */
function buildExploreUrl(loc: DemoLocation, coords?: Coords): string {
  if (loc.exploreUrl) return loc.exploreUrl;
  if (coords) return LocationService.buildMapsSearchUrl(coords.latitude, coords.longitude, loc.name);
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name)}`;
}

/** Directions action: a maps directions deep link, scoped to known coordinates (if any) plus the location name. */
function buildDirectionsUrl(loc: DemoLocation, coords?: Coords): string {
  const destination = coords ? `${loc.name} near ${coords.latitude},${coords.longitude}` : loc.name;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
}

export function TakeItOutsidePanel({ ecosystem, onClose, onStartWalk }: TakeItOutsidePanelProps) {
  const [state, setState] = useState<PanelState>('idle');
  const [result, setResult] = useState<LocationResult | null>(null);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);

  const regionOptions = LocationService.getManualRegionOptions();
  const selectedRegionOption = selectedRegionId
    ? regionOptions.find((option) => option.id === selectedRegionId)
    : undefined;

  /** Demo locations for the resolved-with-matchedRegion path, keyed to the region LocationService actually matched. */
  const resolvedDemoLocations: DemoLocation[] =
    result && result.status === 'resolved' && result.matchedRegion
      ? LocationService.getFallbackLocations(ecosystem.type, result.matchedRegion.id)
      : [];

  /** Demo locations for the manual-selection path, keyed to whichever region the user clicked. */
  const manualDemoLocations: DemoLocation[] = selectedRegionId
    ? LocationService.getFallbackLocations(ecosystem.type, selectedRegionId)
    : [];

  const runResolveLocation = async () => {
    setState('resolving');
    const resolved = await LocationService.resolveLocation();
    setResult(resolved);
    setState(resolved.status === 'resolved' || resolved.status === 'geocode-failed' ? 'resolved' : 'unresolved');
  };

  const handleFindNearby = () => {
    void runResolveLocation();
  };

  const renderDemoLocationCard = (loc: DemoLocation, coords?: Coords) => (
    <div key={loc.id} className="rounded-xl border border-white/10 bg-black/20 p-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm font-medium text-vault-offwhite">{loc.name}</p>
        <span className="shrink-0 rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-vault-offwhite/70">
          Demo location
        </span>
      </div>
      <p className="text-xs text-vault-offwhite/50">
        {loc.type} · {loc.distanceLabel}
      </p>
      <p className="mt-1.5 text-xs text-vault-offwhite/70">{loc.description}</p>
      <div className="mt-2 flex gap-2">
        <a
          href={buildExploreUrl(loc, coords)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full bg-vault-sage/20 px-3 py-1.5 text-xs font-semibold text-vault-sage-light hover:bg-vault-sage/30"
        >
          Explore
        </a>
        <a
          href={buildDirectionsUrl(loc, coords)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block rounded-full border border-white/20 px-3 py-1.5 text-xs font-semibold text-vault-offwhite/85 hover:border-white/40 hover:text-vault-offwhite"
        >
          Directions
        </a>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass-panel w-full max-w-lg rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl text-vault-offwhite">TAKE IT OUTSIDE</h2>
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
          You explored this ecosystem digitally. Now find something similar in the real world.
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
            {result.status === 'resolved' && (
              <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/50">
                Nearby Nature — Based on your location
              </p>
            )}

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

            {result.status === 'resolved' && result.matchedRegion && (
              <div className="space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/50">
                  Example {result.matchedRegion.label} locations
                </p>
                {resolvedDemoLocations.map((loc) =>
                  renderDemoLocationCard(loc, { latitude: result.latitude, longitude: result.longitude }),
                )}
              </div>
            )}
          </div>
        )}

        {state === 'unresolved' && (
          <>
            <p className="mt-4 text-sm text-vault-offwhite/75">We couldn't access your location.</p>
            <LocationSelector
              onRegionSelected={(regionId) => setSelectedRegionId(regionId)}
              onRetryLocation={() => {
                LocationService.clearCache();
                void runResolveLocation();
              }}
            />
            {selectedRegionId && (
              <div className="mt-4 space-y-2">
                <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-offwhite/50">
                  Example {selectedRegionOption?.label ?? ''} locations
                </p>
                {manualDemoLocations.map((loc) => renderDemoLocationCard(loc))}
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
