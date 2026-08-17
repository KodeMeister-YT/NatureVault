import { useEffect, useState } from 'react';

/**
 * Tracks window scrollY and prefers-reduced-motion, throttled via requestAnimationFrame
 * so parallax transforms never run more than once per frame. No new dependency —
 * plain scroll/matchMedia listeners, safe for SSR-less Vite/Vercel static hosting.
 */
export function useScrollParallax() {
  const [scrollY, setScrollY] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(media.matches);
    const onMediaChange = () => setReducedMotion(media.matches);
    media.addEventListener('change', onMediaChange);

    if (media.matches) {
      return () => media.removeEventListener('change', onMediaChange);
    }

    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      media.removeEventListener('change', onMediaChange);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return { scrollY, reducedMotion };
}