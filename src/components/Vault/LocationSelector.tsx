import { useState } from 'react';
import { LocationService } from '../../services/LocationService';

interface LocationSelectorProps {
  onDemoModeSelected: () => void;
  onRetryLocation: () => void;
}

/**
 * Shown when LocationService.resolveLocation() returns an UnresolvedLocation.
 * Offers a curated demo-region option, a free-text city search that only
 * builds a maps deep link (no geocoding needed — Maps' own search box resolves
 * the free-text query), and a way to retry real location access.
 */
export function LocationSelector({ onDemoModeSelected, onRetryLocation }: LocationSelectorProps) {
  const [cityQuery, setCityQuery] = useState('');
  const regionOptions = LocationService.getManualRegionOptions();

  const handleCitySearch = () => {
    const trimmed = cityQuery.trim();
    if (!trimmed) return;
    // A free-text city query doesn't need real coordinates — Maps' own search
    // resolves "parks near <city>" without us geocoding it ourselves.
    const cityOnlyUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`parks near ${trimmed}`)}`;
    window.open(cityOnlyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="mt-5 space-y-4">
      <p className="text-xs text-vault-offwhite/70">
        We couldn't detect your location. Choose a region or search manually — we won't guess.
      </p>

      <div className="space-y-2">
        {regionOptions.map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => {
              if (option.isDemoDataset) onDemoModeSelected();
            }}
            className="w-full rounded-xl border border-white/10 bg-black/20 px-4 py-2.5 text-left text-sm text-vault-offwhite/85 transition-colors hover:border-white/25 hover:bg-black/30"
          >
            {option.label}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={cityQuery}
          onChange={(e) => setCityQuery(e.target.value)}
          placeholder="Type a city…"
          aria-label="Search for a city"
          className="flex-1 rounded-full border border-white/15 bg-black/20 px-3.5 py-2 text-sm text-vault-offwhite placeholder:text-vault-offwhite/40 focus:border-vault-sage focus:outline-none"
        />
        <button
          type="button"
          onClick={handleCitySearch}
          disabled={!cityQuery.trim()}
          className="rounded-full bg-vault-sage px-4 py-2 text-sm font-semibold text-vault-forest-deep transition-colors hover:bg-vault-sage-light disabled:opacity-50"
        >
          Search
        </button>
      </div>

      <button
        type="button"
        onClick={onRetryLocation}
        className="w-full rounded-full border border-white/20 px-4 py-2 text-xs font-medium text-vault-offwhite/80 transition-colors hover:border-white/40 hover:text-vault-offwhite"
      >
        Try location access again
      </button>
    </div>
  );
}
