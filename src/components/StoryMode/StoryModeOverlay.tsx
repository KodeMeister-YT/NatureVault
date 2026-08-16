import type { StoryChapter } from '../../types/vault';

interface StoryModeOverlayProps {
  chapters: StoryChapter[];
  chapterIndex: number;
  onNext: () => void;
  onPrev: () => void;
  onExit: () => void;
}

export function StoryModeOverlay({ chapters, chapterIndex, onNext, onPrev, onExit }: StoryModeOverlayProps) {
  const chapter = chapters[chapterIndex];
  const isLast = chapterIndex === chapters.length - 1;

  return (
    <div className="glass-panel pointer-events-auto absolute bottom-6 left-1/2 z-30 w-[min(94vw,640px)] -translate-x-1/2 rounded-2xl p-5 motion-safe:animate-fade-in-up">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-vault-gold">
            Chapter {chapterIndex + 1} of {chapters.length}
          </p>
          <h3 className="font-display text-xl text-vault-offwhite">{chapter.title}</h3>
        </div>
        <button
          type="button"
          onClick={onExit}
          className="rounded-full px-3 py-1 text-xs text-vault-offwhite/70 transition-colors hover:bg-white/10 hover:text-vault-offwhite"
        >
          Exit Story
        </button>
      </div>
      <p className="mt-3 text-sm text-vault-offwhite/85">{chapter.narration}</p>
      <div className="mt-4 flex items-center justify-between">
        <button
          type="button"
          onClick={onPrev}
          disabled={chapterIndex === 0}
          className="rounded-full border border-white/15 px-4 py-1.5 text-xs font-medium text-vault-offwhite/80 transition-colors hover:border-white/40 disabled:opacity-30"
        >
          Back
        </button>
        <div className="flex gap-1.5">
          {chapters.map((c, i) => (
            <span
              key={c.id}
              className={`h-1.5 w-6 rounded-full transition-colors ${
                i === chapterIndex ? 'bg-vault-gold' : 'bg-white/15'
              }`}
            />
          ))}
        </div>
        {isLast ? (
          <button
            type="button"
            onClick={onExit}
            className="rounded-full bg-vault-sage px-4 py-1.5 text-xs font-semibold text-vault-forest-deep hover:bg-vault-sage-light"
          >
            Finish
          </button>
        ) : (
          <button
            type="button"
            onClick={onNext}
            className="rounded-full bg-vault-sage px-4 py-1.5 text-xs font-semibold text-vault-forest-deep hover:bg-vault-sage-light"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
