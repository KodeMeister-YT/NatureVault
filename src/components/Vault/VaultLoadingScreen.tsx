import { useEffect, useState } from 'react';
import type { BiomeDefinition } from '../../types/vault';
import type { TerrainKind, WaterKind } from '../../types/biome';

// Stage 1 copy, driven by the biome's terrain strategy — so a desert reads
// "Loading dunes" rather than the generic "Loading terrain" every other
// biome previously shared.
const terrainStageLabel: Record<TerrainKind, string> = {
  'rolling-hills': 'Loading terrain',
  'flat-grassland': 'Loading grassland',
  'duned-desert': 'Loading dunes',
  'elevated-cliffs': 'Loading cliffs',
  seafloor: 'Loading seafloor',
};

// Stage 2 copy, driven by the biome's water feature — a biome with
// water.kind: 'none' (desert) never references streams/shoreline/coral it
// doesn't have.
const waterStageLabel: Record<WaterKind, string> = {
  none: 'Restoring vegetation',
  'creek-stream': 'Restoring streams',
  'pond-marsh': 'Restoring vegetation',
  'lake-shoreline': 'Restoring shoreline',
  waterfall: 'Restoring canopy',
  'underwater-ambient': 'Restoring coral',
};

// Stage 3 copy — mostly generic "wildlife", but reads as "marine life" for
// the fully submerged reef biome where "wildlife" would feel a little off.
function wildlifeStageLabel(water: WaterKind): string {
  return water === 'underwater-ambient' ? 'Reconstructing marine life' : 'Reconstructing wildlife';
}

function buildStages(biome?: BiomeDefinition): string[] {
  if (!biome) {
    return ['Loading terrain', 'Restoring vegetation', 'Reconstructing wildlife', 'Synchronizing timeline'];
  }
  return [
    terrainStageLabel[biome.terrain.kind],
    waterStageLabel[biome.water.kind],
    wildlifeStageLabel(biome.water.kind),
    'Synchronizing timeline',
  ];
}

export function VaultLoadingScreen({ onDone, vault }: { onDone: () => void; vault?: BiomeDefinition }) {
  const [stageIndex, setStageIndex] = useState(0);
  const stages = buildStages(vault);

  useEffect(() => {
    if (stageIndex >= stages.length) {
      const t = setTimeout(onDone, 350);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => setStageIndex((i) => i + 1), 320);
    return () => clearTimeout(t);
  }, [stageIndex, onDone]);

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-vault-forest-deep text-vault-offwhite">
      <p className="font-display text-2xl">Restoring ecosystem…</p>
      <div className="mt-6 flex flex-col items-center gap-2">
        {stages.map((stage, i) => (
          <p
            key={stage}
            className={`text-sm transition-colors ${
              i < stageIndex
                ? 'text-vault-sage-light'
                : i === stageIndex
                  ? 'text-vault-offwhite'
                  : 'text-vault-offwhite/30'
            }`}
          >
            {i < stageIndex ? '✓ ' : ''}
            {stage}
            {i === stageIndex ? '…' : ''}
          </p>
        ))}
      </div>
      {stageIndex >= stages.length && (
        <p className="mt-6 font-display text-lg text-vault-gold motion-safe:animate-fade-in">Vault ready.</p>
      )}
    </div>
  );
}
