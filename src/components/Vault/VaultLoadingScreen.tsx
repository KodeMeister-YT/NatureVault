import { useEffect, useState } from 'react';

const stages = ['Loading terrain', 'Restoring vegetation', 'Reconstructing wildlife', 'Synchronizing timeline'];

export function VaultLoadingScreen({ onDone }: { onDone: () => void }) {
  const [stageIndex, setStageIndex] = useState(0);

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
