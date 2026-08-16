import { useEffect, useState } from 'react';
import { natureWalkPrompts, walkDurations } from '../../data/observations/natureWalkPrompts';
import { useAppStore } from '../../store/useAppStore';

interface NatureWalkModalProps {
  onClose: () => void;
}

type Stage = 'select-duration' | 'walking' | 'summary';

export function NatureWalkModal({ onClose }: NatureWalkModalProps) {
  const [stage, setStage] = useState<Stage>('select-duration');
  const [duration, setDuration] = useState<number | null>(null);
  const [promptIndex, setPromptIndex] = useState(0);
  const [discovered, setDiscovered] = useState<string[]>([]);
  const incrementNatureWalksCompleted = useAppStore((s) => s.incrementNatureWalksCompleted);

  const activePrompts = natureWalkPrompts.slice(0, 4);

  useEffect(() => {
    if (stage === 'summary') {
      incrementNatureWalksCompleted();
    }
  }, [stage, incrementNatureWalksCompleted]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="glass-panel w-full max-w-md rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <h2 className="font-display text-2xl text-vault-offwhite">Nature Walk</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="rounded-full p-1 text-vault-offwhite/60 hover:bg-white/10 hover:text-vault-offwhite"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {stage === 'select-duration' && (
          <>
            <p className="mt-2 text-sm text-vault-offwhite/75">
              Step away from the screen. Choose how long you'd like to walk.
            </p>
            <div className="mt-5 flex gap-3">
              {walkDurations.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => {
                    setDuration(d);
                    setStage('walking');
                  }}
                  className="flex-1 rounded-xl border border-white/15 py-3 text-sm font-semibold text-vault-offwhite/90 transition-colors hover:border-vault-sage hover:text-vault-offwhite"
                >
                  {d} min
                </button>
              ))}
            </div>
          </>
        )}

        {stage === 'walking' && (
          <>
            <p className="mt-2 text-xs uppercase tracking-wide text-vault-sage-light">
              {duration} minute walk · Prompt {promptIndex + 1} of {activePrompts.length}
            </p>
            <p className="mt-4 font-display text-xl text-vault-offwhite">During your walk:</p>
            <p className="mt-2 text-lg text-vault-offwhite/90">{activePrompts[promptIndex].prompt}</p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => {
                  setDiscovered((prev) => [...prev, activePrompts[promptIndex].id]);
                  if (promptIndex + 1 < activePrompts.length) {
                    setPromptIndex((i) => i + 1);
                  } else {
                    setStage('summary');
                  }
                }}
                className="flex-1 rounded-full bg-vault-sage px-5 py-2.5 text-sm font-semibold text-vault-forest-deep hover:bg-vault-sage-light"
              >
                Found it
              </button>
              <button
                type="button"
                onClick={() => {
                  if (promptIndex + 1 < activePrompts.length) {
                    setPromptIndex((i) => i + 1);
                  } else {
                    setStage('summary');
                  }
                }}
                className="flex-1 rounded-full border border-white/20 px-5 py-2.5 text-sm font-medium text-vault-offwhite/80 hover:border-white/40"
              >
                Skip
              </button>
            </div>
          </>
        )}

        {stage === 'summary' && (
          <>
            <p className="mt-4 font-display text-xl text-vault-offwhite">
              You discovered {discovered.length} thing{discovered.length === 1 ? '' : 's'} you normally would have
              walked past.
            </p>
            <p className="mt-3 text-sm text-vault-offwhite/70">
              That's the point of NatureVault — using technology to make you care enough to go experience the real
              thing.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 w-full rounded-full bg-vault-sage px-5 py-2.5 text-sm font-semibold text-vault-forest-deep hover:bg-vault-sage-light"
            >
              Done
            </button>
          </>
        )}
      </div>
    </div>
  );
}
