interface TimelineProps {
  years: number[];
  year: number;
  onChange: (year: number) => void;
}

export function Timeline({ years, year, onChange }: TimelineProps) {
  const min = years[0];
  const max = years[years.length - 1];
  const percent = ((year - min) / (max - min)) * 100;

  // When there are more than 5 years, only show first/last/current as visible
  // tick labels to avoid crowding. All years remain draggable/snappable/tappable
  // stops on the range input regardless — only the visible label set changes.
  const visibleYears =
    years.length > 5
      ? Array.from(new Set([min, year, max])).sort((a, b) => a - b)
      : years;

  return (
    <div className="glass-panel flex flex-col gap-2 rounded-2xl px-5 py-3">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wide text-vault-offwhite/60">
        <span>Time Machine</span>
        <span className="font-display text-sm text-vault-gold">{year}</span>
      </div>
      <div className="relative w-64 sm:w-80">
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
        {years.length > 5 ? (
          <div className="relative mt-1 h-4 text-[11px] text-vault-offwhite/50">
            {visibleYears.map((y) => {
              const labelPercent = ((y - min) / (max - min)) * 100;
              return (
                <button
                  key={y}
                  type="button"
                  onClick={() => onChange(y)}
                  style={{ left: `${labelPercent}%` }}
                  className={`absolute top-0 -translate-x-1/2 whitespace-nowrap transition-colors first:translate-x-0 last:-translate-x-full ${
                    y === year ? 'font-semibold text-vault-gold' : 'hover:text-vault-offwhite'
                  }`}
                >
                  {y}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="mt-1 flex justify-between text-[11px] text-vault-offwhite/50">
            {years.map((y) => (
              <button
                key={y}
                type="button"
                onClick={() => onChange(y)}
                className={`transition-colors ${y === year ? 'font-semibold text-vault-gold' : 'hover:text-vault-offwhite'}`}
              >
                {y}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
