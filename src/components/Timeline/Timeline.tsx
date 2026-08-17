interface TimelineProps {
  years: number[];
  year: number;
  onChange: (year: number) => void;
}

export function Timeline({ years, year, onChange }: TimelineProps) {
  const min = years[0];
  const max = years[years.length - 1];
  const percent = ((year - min) / (max - min)) * 100;

  return (
    <div className="glass-panel flex flex-col gap-2 rounded-2xl px-5 py-3">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-vault-offwhite/60">
        <span>Time Machine</span>
        <span className="font-display text-sm text-vault-gold">{year}</span>
      </div>
      {/* Track widened from w-64/w-80 to w-72/w-[26rem] so that every year in the
          longest real biome arrays (7 entries — Coastal Wetland, Freshwater Lake)
          has enough room for a fully visible, non-overlapping label. The
          ScenarioSwitcher sits below this in the same flex column and has no
          fixed width, so widening the timeline doesn't crowd it. */}
      <div className="relative w-72 sm:w-[26rem]">
        <div className="absolute left-0 right-0 top-1/2 h-[2px] -translate-y-1/2 bg-white/15" />
        <div
          className="absolute left-0 top-1/2 h-[2px] -translate-y-1/2 bg-vault-gold"
          style={{ width: `${percent}%` }}
        />
        <input
          type="range"
          aria-label="Select year"
          min={min}
          max={max}
          step={1}
          value={year}
          onChange={(e) => {
            const target = Number(e.target.value);
            const nearest = years.reduce((closest, y) => (Math.abs(y - target) < Math.abs(closest - target) ? y : closest), years[0]);
            onChange(nearest);
          }}
          list="vault-years"
          className="relative z-10 h-4 w-full cursor-pointer appearance-none bg-transparent [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-vault-gold [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-vault-gold"
        />
        {/* Every year in `years` gets a visible label, positioned proportionally
            along the track (reusing the same min/max percent math as the fill
            bar above). The currently-selected year is bolded/gold; the rest use
            a higher-contrast offwhite/70 (up from /50) since the glass-panel
            background must stay readable against every biome's atmosphere.
            Font size steps down as the array grows so labels for the longest
            (7-entry) arrays stay legible.

            Because real `years` values aren't evenly spaced (e.g. Freshwater
            Lake's 2019 and 2026 sit just 7% apart on a 100-year span), two
            adjacent proportional labels can land close enough to collide when
            there are more than 4 of them. Rather than let that happen, labels
            alternate between two rows (a light zig-zag) once there are more
            than 4 years, which guarantees horizontal breathing room between
            any two neighbors regardless of how the underlying years are
            distributed, while a short tick still ties each label back to its
            exact position on the track. */}
        <div
          className={`relative mt-1.5 ${years.length > 4 ? 'h-9' : 'h-4'} ${
            years.length >= 7 ? 'text-[9px]' : years.length > 5 ? 'text-[10px]' : 'text-[11px]'
          } text-vault-offwhite/70`}
        >
          {years.map((y, i) => {
            const labelPercent = ((y - min) / (max - min)) * 100;
            const staggered = years.length > 4 && i % 2 === 1;
            return (
              <div
                key={y}
                style={{ left: `${labelPercent}%` }}
                className="absolute top-0 -translate-x-1/2 first:translate-x-0 last:-translate-x-full"
              >
                {staggered && <div className="mx-auto h-1.5 w-px bg-white/25" />}
                <button
                  type="button"
                  onClick={() => onChange(y)}
                  className={`block whitespace-nowrap tracking-tight transition-colors ${
                    y === year ? 'font-semibold text-vault-gold' : 'hover:text-vault-offwhite'
                  }`}
                >
                  {y}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
