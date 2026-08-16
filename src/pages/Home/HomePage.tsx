import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';

export function HomePage() {
  const navigate = useNavigate();
  const startDemoMode = useAppStore((s) => s.startDemoMode);

  return (
    <div className="bg-vault-forest-deep text-vault-offwhite">
      {/* Fixed top bar sits above every section */}
      <div className="fixed inset-x-0 top-0 z-40 flex items-center justify-between px-6 py-5 sm:px-10">
        <span className="font-display text-lg tracking-wide">NatureVault</span>
        <button
          type="button"
          onClick={() => {
            startDemoMode();
            navigate('/discover');
          }}
          className="rounded-full border border-vault-gold/50 bg-vault-gold/10 px-4 py-1.5 text-xs font-semibold tracking-wide text-vault-gold backdrop-blur-sm transition-colors hover:bg-vault-gold/20"
        >
          Demo Mode
        </button>
      </div>

      {/* ---------------- SECTION 1: HERO ---------------- */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a14] via-[#122019] to-vault-forest-deep" />
          <svg className="absolute bottom-[38%] left-0 w-full opacity-40" viewBox="0 0 1200 300" preserveAspectRatio="none">
            <path
              d="M0 300 L0 180 L120 90 L220 160 L340 60 L460 150 L600 40 L740 140 L860 80 L1000 170 L1120 100 L1200 190 L1200 300 Z"
              fill="#1a2f24"
            />
          </svg>
          <svg
            className="absolute bottom-[18%] left-0 w-[120%] opacity-70 motion-safe:animate-drift"
            viewBox="0 0 1400 260"
            preserveAspectRatio="none"
          >
            <path
              d="M0 260 L0 140 Q40 90 80 140 Q110 70 150 140 Q190 80 230 140 Q270 60 310 140 Q350 95 390 140 L430 140 Q470 75 510 140 Q550 90 590 140 Q630 65 670 140 Q710 100 750 140 L1400 140 L1400 260 Z"
              fill="#152720"
            />
          </svg>
          <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1200 260" preserveAspectRatio="none">
            <path
              d="M0 260 L0 120 Q30 60 60 120 Q80 40 100 120 Q130 50 160 120 L200 120 Q230 55 260 120 Q285 30 310 120 Q345 65 380 120 L1200 120 L1200 260 Z"
              fill="#0a1510"
            />
          </svg>
          <div className="absolute inset-0">
            {Array.from({ length: 14 }).map((_, i) => (
              <span
                key={i}
                className="absolute block h-1 w-1 rounded-full bg-vault-gold/40 motion-safe:animate-float"
                style={{
                  left: `${(i * 7.3) % 100}%`,
                  top: `${20 + ((i * 13) % 60)}%`,
                  animationDelay: `${(i % 6) * 0.7}s`,
                  animationDuration: `${6 + (i % 5)}s`,
                }}
              />
            ))}
          </div>
        </div>

        <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center">
          <p className="mb-4 text-xs font-medium uppercase tracking-[0.3em] text-vault-sage-light/80 motion-safe:animate-fade-in">
            An interactive time machine for ecosystems
          </p>
          <h1 className="font-display max-w-4xl text-5xl leading-[1.05] tracking-tight sm:text-6xl md:text-7xl motion-safe:animate-fade-in-up">
            Step inside nature.
          </h1>
          <p
            className="mt-6 max-w-xl text-base text-vault-offwhite/80 sm:text-lg motion-safe:animate-fade-in-up"
            style={{ animationDelay: '0.15s' }}
          >
            Explore ecosystems across time and discover how today's choices shape tomorrow's world.
          </p>

          <div
            className="mt-10 flex flex-col items-center gap-4 sm:flex-row motion-safe:animate-fade-in-up"
            style={{ animationDelay: '0.3s' }}
          >
            <button
              type="button"
              onClick={() => navigate('/vault/coastal-wetland')}
              className="rounded-full bg-vault-sage px-8 py-3 text-sm font-semibold tracking-wide text-vault-forest-deep transition-transform hover:scale-[1.03] hover:bg-vault-sage-light"
            >
              Enter the Vault
            </button>
            <button
              type="button"
              onClick={() => navigate('/discover')}
              className="rounded-full border border-white/25 px-8 py-3 text-sm font-medium tracking-wide text-vault-offwhite/90 transition-colors hover:border-white/50 hover:text-vault-offwhite"
            >
              Explore Ecosystems
            </button>
          </div>
        </div>

        <div className="relative z-10 mx-auto mb-8 flex w-full max-w-7xl items-center justify-between px-6 text-xs text-vault-offwhite/50">
          <span>Coastal Wetland · 1980 — 2050</span>
          <span className="hidden animate-bounce items-center gap-1.5 sm:flex">
            Scroll to continue
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </div>
      </section>

      {/* ---------------- SECTION 2: THE PROBLEM ---------------- */}
      <section className="relative flex min-h-screen items-center bg-vault-charcoal px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vault-gold">The problem</p>
          <h2 className="font-display mt-4 text-3xl leading-tight sm:text-4xl md:text-5xl">
            Environmental change is often reduced to numbers.
          </h2>
          <p className="mt-6 max-w-xl text-base text-vault-offwhite/70 sm:text-lg">
            "Forest coverage decreased by 31%." A statistic like that is accurate, and easy to forget five
            minutes later. Charts and percentages describe a place without letting you stand in it.
          </p>
          <p className="mt-4 max-w-xl text-base text-vault-offwhite/70 sm:text-lg">
            People protect what they understand — and they understand places, not spreadsheets.
          </p>
        </div>
      </section>

      {/* ---------------- SECTION 3: THE CONCEPT ---------------- */}
      <section className="relative flex min-h-screen items-center bg-vault-forest-deep px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vault-gold">The NatureVault concept</p>
          <h2 className="font-display mt-4 text-3xl leading-tight sm:text-4xl md:text-5xl">
            Explore ecosystems across time.
          </h2>
          <p className="mt-6 max-w-xl text-base text-vault-offwhite/70 sm:text-lg">
            Every Vault is a small, explorable 3D reconstruction of a real kind of place — a forest, a wetland,
            an alpine slope, a city park. Walk through it. Look around. Click what catches your eye.
          </p>
          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { title: 'Enter', body: 'Step into a 3D reconstruction of a real ecosystem type.' },
              { title: 'Compare', body: 'See the same location across its past, present, and possible futures.' },
              { title: 'Understand', body: 'Click objects to learn what changed, and why it matters.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
                <p className="font-display text-lg text-vault-sage-light">{item.title}</p>
                <p className="mt-2 text-sm text-vault-offwhite/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 4: INTERACTIVE PREVIEW ---------------- */}
      <section className="relative flex min-h-screen items-center bg-vault-charcoal px-6 py-24 sm:px-10">
        <div className="mx-auto w-full max-w-4xl">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-vault-gold">Past → Present → Future</p>
          <h2 className="font-display mt-4 text-3xl leading-tight sm:text-4xl md:text-5xl">
            One place. Three moments in time.
          </h2>
          <p className="mt-6 max-w-xl text-base text-vault-offwhite/70 sm:text-lg">
            Drag the timeline inside any Vault and watch the world itself respond — vegetation, water level, and
            wildlife all shift to match the year you're standing in.
          </p>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { year: '1980', label: 'Dense wetland, abundant wildlife', tone: 'from-[#0c2226] to-[#1b3a3d]' },
              { year: '2026', label: 'Fragmented habitat, reduced flow', tone: 'from-[#17262f] to-[#233f45]' },
              { year: '2050', label: 'Two possible futures', tone: 'from-[#1a2e22] to-[#2c4a34]' },
            ].map((item) => (
              <div
                key={item.year}
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-5`}
              >
                <p className="font-display text-2xl text-vault-offwhite">{item.year}</p>
                <p className="mt-2 text-sm text-vault-offwhite/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 5: CALL TO ACTION ---------------- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center bg-vault-forest-deep px-6 py-24 text-center sm:px-10">
        <h2 className="font-display max-w-2xl text-3xl leading-tight sm:text-4xl md:text-5xl">
          We don't want you to just read about what we're losing.
        </h2>
        <p className="font-display mt-3 text-2xl text-vault-gold sm:text-3xl">We want you to step inside it.</p>

        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row">
          <button
            type="button"
            onClick={() => navigate('/vault/coastal-wetland')}
            className="rounded-full bg-vault-sage px-8 py-3 text-sm font-semibold tracking-wide text-vault-forest-deep transition-transform hover:scale-[1.03] hover:bg-vault-sage-light"
          >
            Enter the Vault
          </button>
          <button
            type="button"
            onClick={() => navigate('/discover')}
            className="rounded-full border border-white/25 px-8 py-3 text-sm font-medium tracking-wide text-vault-offwhite/90 transition-colors hover:border-white/50 hover:text-vault-offwhite"
          >
            Explore Ecosystems
          </button>
        </div>

        <footer className="mt-16 text-xs text-vault-offwhite/40">NatureVault · An interactive time machine for ecosystems</footer>
      </section>
    </div>
  );
}
