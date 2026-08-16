import { useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import type { VaultDefinition, VaultStateMetrics } from '../../types/vault';
import { Terrain } from '../Ecosystem/Terrain';
import { SkyAndClouds } from '../Ecosystem/SkyAndClouds';
import { EnvironmentalObjectRenderer } from '../Ecosystem/EnvironmentalObjectRenderer';
import type { CompareMode } from '../../store/useVaultSessionStore';

interface CompareViewProps {
  vault: VaultDefinition;
  leftYear: number;
  rightYear: number;
  leftMetrics: VaultStateMetrics;
  rightMetrics: VaultStateMetrics;
  mode: CompareMode;
  onClose: () => void;
}

function MiniScene({
  vault,
  year,
  metrics,
}: {
  vault: VaultDefinition;
  year: number;
  metrics: VaultStateMetrics;
}) {
  const objects = vault.objects.filter((o) => o.presentInYears.includes(year));
  const waterBodies = objects
    .filter((o) => o.kind === 'river' || o.kind === 'pond')
    .map((o) => ({ position: o.position, radius: o.kind === 'river' ? 9 : 4.5 }));
  return (
    <Canvas camera={{ position: [0, 4, 10], fov: 55 }} dpr={[1, 1.4]} shadows>
      <directionalLight position={[18, 14, 10]} intensity={2.2} color="#fff1d6" castShadow />
      <ambientLight intensity={0.45} color="#cfe6df" />
      <hemisphereLight args={['#bcd8e8', '#3c4a2e', 0.65]} />
      <SkyAndClouds developmentLevel={metrics.developmentLevel} />
      <Terrain developmentLevel={metrics.developmentLevel} waterLevel={metrics.waterLevel} waterBodies={waterBodies} />
      {objects.map((object) => (
        <EnvironmentalObjectRenderer
          key={object.id}
          object={object}
          vegetationDensity={metrics.vegetationDensity}
          waterLevel={metrics.waterLevel}
          biodiversityLevel={metrics.biodiversityLevel}
          developmentLevel={metrics.developmentLevel}
          selected={false}
          highlighted={false}
          dimmed={false}
          onSelect={() => {}}
          onHover={() => {}}
        />
      ))}
      <OrbitControls
        enableDamping
        dampingFactor={0.08}
        minDistance={4}
        maxDistance={40}
        maxPolarAngle={Math.PI / 2.1}
        target={[0, 1, 0]}
      />
    </Canvas>
  );
}

export function CompareView({ vault, leftYear, rightYear, leftMetrics, rightMetrics, mode, onClose }: CompareViewProps) {
  const [swipePercent, setSwipePercent] = useState(50);

  return (
    <div className="absolute inset-0 z-40 bg-vault-charcoal">
      <div className="glass-panel absolute left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2">
        <span className="text-xs font-semibold text-vault-offwhite/70">Comparing</span>
        <span className="font-display text-sm text-vault-gold">{leftYear}</span>
        <span aria-hidden="true" className="text-vault-offwhite/40">
          vs
        </span>
        <span className="font-display text-sm text-vault-gold">{rightYear}</span>
        <button
          type="button"
          onClick={onClose}
          className="ml-2 rounded-full px-2 py-1 text-xs text-vault-offwhite/70 hover:bg-white/10 hover:text-vault-offwhite"
        >
          Close
        </button>
      </div>

      {mode === 'split' && (
        <div className="grid h-full grid-cols-1 md:grid-cols-2">
          <div className="relative h-1/2 border-b border-white/10 md:h-full md:border-b-0 md:border-r">
            <span className="glass-panel absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold">
              {leftYear}
            </span>
            <MiniScene vault={vault} year={leftYear} metrics={leftMetrics} />
          </div>
          <div className="relative h-1/2 md:h-full">
            <span className="glass-panel absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold">
              {rightYear}
            </span>
            <MiniScene vault={vault} year={rightYear} metrics={rightMetrics} />
          </div>
        </div>
      )}

      {mode === 'swipe' && (
        <div className="relative h-full w-full">
          <div className="absolute inset-0">
            <span className="glass-panel absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold">
              {rightYear}
            </span>
            <MiniScene vault={vault} year={rightYear} metrics={rightMetrics} />
          </div>
          <div
            className="absolute inset-0 overflow-hidden"
            style={{ clipPath: `inset(0 ${100 - swipePercent}% 0 0)` }}
          >
            <span className="glass-panel absolute left-3 top-3 z-10 rounded-full px-3 py-1 text-xs font-semibold">
              {leftYear}
            </span>
            <MiniScene vault={vault} year={leftYear} metrics={leftMetrics} />
          </div>
          <div
            className="absolute top-0 bottom-0 z-20 w-1 -translate-x-1/2 bg-vault-gold"
            style={{ left: `${swipePercent}%` }}
          />
          <input
            type="range"
            aria-label="Swipe comparison slider"
            min={0}
            max={100}
            value={swipePercent}
            onChange={(e) => setSwipePercent(Number(e.target.value))}
            className="absolute bottom-6 left-1/2 z-30 w-[min(80vw,360px)] -translate-x-1/2 accent-vault-gold"
          />
        </div>
      )}
    </div>
  );
}
