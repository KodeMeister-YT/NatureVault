import { useEffect, useRef, useState } from 'react';
import type { VaultStateMetrics } from '../types/vault';
import { lerpMetrics } from '../services/ScenarioService';

const DURATION_MS = 1100;

function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/** Smoothly animates between VaultStateMetrics whenever the target changes. */
export function useAnimatedMetrics(target: VaultStateMetrics): VaultStateMetrics {
  const [current, setCurrent] = useState(target);
  const fromRef = useRef(target);
  const startRef = useRef<number | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    fromRef.current = current;
    startRef.current = null;

    const step = (time: number) => {
      if (startRef.current === null) startRef.current = time;
      const elapsed = time - startRef.current;
      const t = Math.min(1, elapsed / DURATION_MS);
      const eased = easeInOutCubic(t);
      setCurrent(lerpMetrics(fromRef.current, target, eased));
      if (t < 1) {
        rafRef.current = requestAnimationFrame(step);
      }
    };

    rafRef.current = requestAnimationFrame(step);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target.vegetationDensity, target.waterLevel, target.biodiversityLevel, target.developmentLevel]);

  return current;
}
