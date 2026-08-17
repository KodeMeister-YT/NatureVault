import { useNavigate } from 'react-router-dom';
import { useAppStore } from '../../store/useAppStore';
import { useScrollParallax } from '../../hooks/useScrollParallax';

export function HomePage() {
  const navigate = useNavigate();
  const startDemoMode = useAppStore((s) => s.startDemoMode);
  const { scrollY, reducedMotion } = useScrollParallax();

  // Parallax offsets: each "depth" layer moves at a different fraction of scroll
  // distance so the hero reads as layered depth rather than a single flat image
  // scrolling past. Reduced-motion users get all offsets pinned to 0 (no motion),
  // satisfying prefers-reduced-motion without a second code path.
  const offset = (speed: number) => (reducedMotion ? 0 : Math.min(scrollY * speed, 420));

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

      {/* ---------------- SECTION 1: HERO (multi-layer parallax) ---------------- */}
      <section className="relative flex min-h-screen flex-col overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Layer 0: sky gradient — fixed, no parallax, sits behind everything */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0d1a14] via-[#122019] to-vault-forest-deep" />

          {/* Layer 1: distant background ridge — slowest movement (furthest away) */}
          <svg
            className="absolute bottom-[42%] left-0 w-full opacity-30 transition-transform will-change-transform"
            style={{ transform: `translateY(${offset(0.08)}px)` }}
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
          >
            <path
              d="M0 300 L0 210 L150 130 L280 190 L420 100 L560 180 L700 90 L840 170 L980 120 L1200 200 L1200 300 Z"
              fill="#0f1f18"
            />
          </svg>

          {/* Layer 2: mid-distance trees/vegetation — moderate speed */}
          <svg
            className="absolute bottom-[30%] left-0 w-full opacity-45 transition-transform will-change-transform"
            style={{ transform: `translateY(${offset(0.16)}px)` }}
            viewBox="0 0 1200 300"
            preserveAspectRatio="none"
          >
            <path
              d="M0 300 L0 180 L120 90 L220 160 L340 60 L460 150 L600 40 L740 140 L860 80 L1000 170 L1120 100 L1200 190 L1200 300 Z"
              fill="#1a2f24"
            />
          </svg>

          {/* Layer 3: atmospheric fog band — drifts horizontally, adds haze/depth separation */}
          <div
            className="absolute inset-x-0 bottom-[24%] h-32 opacity-40 blur-2xl transition-transform will-change-transform"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(168,187,156,0.35), transparent)',
              transform: `translateY(${offset(0.1)}px)`,
            }}
          />

          {/* Layer 4: nearer canopy silhouette — faster than layer 2 */}
          <svg
            className="absolute bottom-[16%] left-0 w-[120%] opacity-75 transition-transform will-change-transform motion-safe:animate-drift"
            style={{ transform: `translateY(${offset(0.26)}px)` }}
            viewBox="0 0 1400 260"
            preserveAspectRatio="none"
          >
            <path
              d="M0 260 L0 140 Q40 90 80 140 Q110 70 150 140 Q190 80 230 140 Q270 60 310 140 Q350 95 390 140 L430 140 Q470 75 510 140 Q550 90 590 140 Q630 65 670 140 Q710 100 750 140 L1400 140 L1400 260 Z"
              fill="#152720"
            />
          </svg>

          {/* Layer 5: foreground vegetation silhouette — fastest, closest to viewer */}
          <svg
            className="absolute bottom-0 left-0 w-full transition-transform will-change-transform"
            style={{ transform: `translateY(${offset(0.4)}px)` }}
            viewBox="0 0 1200 260"
            preserveAspectRatio="none"
          >
            <path
              d="M0 260 L0 120 Q30 60 60 120 Q80 40 100 120 Q130 50 160 120 L200 120 Q230 55 260 120 Q285 30 310 120 Q345 65 380 120 L1200 120 L1200 260 Z"
              fill="#0a1510"
            />
          </svg>

          {/* Layer 6: floating particles — drift independent of scroll, subtle motion only */}
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
                  transform: `translateY(${offset(0.05)}px)`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Layer 7: hero content — moves slightly opposite/slower than background for depth, fades on scroll */}
        <div
          className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 text-center transition-transform will-change-transform"
          style={{
            transform: `translateY(${offset(0.12)}px)`,
            opacity: reducedMotion ? 1 : Math.max(1 - scrollY / 500, 0.15),
          }}
        >
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

      {/* ---------------- SECTION 2: THE PROBLEM (atmospheric ecosystem terrain backdrop) ---------------- */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-vault-charcoal px-6 py-24 sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-[#1b1b1d] via-[#181a19] to-[#12181a]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.08]" preserveAspectRatio="none" viewBox="0 0 1200 800">
            <path d="M0 800 L0 500 L200 380 L400 460 L600 320 L800 420 L1000 340 L1200 440 L1200 800 Z" fill="#7c9070" />
          </svg>
          <div className="absolute inset-0 bg-gradient-to-t from-vault-charcoal via-transparent to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
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

      {/* ---------------- SECTION 3: THE CONCEPT (rich vegetation/landscape backdrop) ---------------- */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-vault-forest-deep px-6 py-24 sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1510] via-[#101f16] to-[#0a1510]" />
          <svg className="absolute bottom-0 left-0 w-full opacity-20" preserveAspectRatio="none" viewBox="0 0 1200 400">
            <path d="M0 400 L0 260 Q60 200 120 260 Q150 180 180 260 Q220 190 260 260 Q300 170 340 260 L1200 260 L1200 400 Z" fill="#294f2a" />
          </svg>
          <div className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-vault-sage/10 to-transparent" />
        </div>
        <div className="relative z-10 mx-auto max-w-3xl">
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
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm">
                <p className="font-display text-lg text-vault-sage-light">{item.title}</p>
                <p className="mt-2 text-sm text-vault-offwhite/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 4: INTERACTIVE PREVIEW / TIME MACHINE (layered time-transition backdrop) ---------------- */}
      <section className="relative flex min-h-screen items-center overflow-hidden bg-vault-charcoal px-6 py-24 sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {/* Left-to-right gradient sweep suggests a timeline / progression through eras */}
          <div className="absolute inset-0 bg-gradient-to-r from-[#0c2226] via-[#1b1b1d] to-[#1a2e22]" />
          <svg className="absolute inset-0 h-full w-full opacity-[0.07]" preserveAspectRatio="none" viewBox="0 0 1200 800">
            <line x1="0" y1="400" x2="1200" y2="400" stroke="#d8b872" strokeWidth="1" strokeDasharray="10 14" />
            <circle cx="150" cy="400" r="4" fill="#d8b872" />
            <circle cx="600" cy="400" r="4" fill="#d8b872" />
            <circle cx="1050" cy="400" r="4" fill="#d8b872" />
          </svg>
        </div>
        <div className="relative z-10 mx-auto w-full max-w-4xl">
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
                className={`rounded-2xl border border-white/10 bg-gradient-to-br ${item.tone} p-5 backdrop-blur-sm`}
              >
                <p className="font-display text-2xl text-vault-offwhite">{item.year}</p>
                <p className="mt-2 text-sm text-vault-offwhite/70">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- SECTION 5: CALL TO ACTION (cinematic nature backdrop with focal point) ---------------- */}
      <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-vault-forest-deep px-6 py-24 text-center sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a1510] via-[#0e1c14] to-[#0a1510]" />
          {/* Radial glow focal point behind the headline */}
          <div
            className="absolute left-1/2 top-1/3 h-[36rem] w-[36rem] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-30 blur-3xl"
            style={{ background: 'radial-gradient(circle, rgba(216,184,114,0.35), transparent 70%)' }}
          />
          <svg className="absolute bottom-0 left-0 w-full opacity-25" preserveAspectRatio="none" viewBox="0 0 1200 260">
            <path
              d="M0 260 L0 120 Q30 60 60 120 Q80 40 100 120 Q130 50 160 120 L200 120 Q230 55 260 120 Q285 30 310 120 Q345 65 380 120 L1200 120 L1200 260 Z"
              fill="#152720"
            />
          </svg>
        </div>
        <div className="relative z-10">
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
        </div>
      </section>
    </div>
  );
}