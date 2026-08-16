import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { VaultService } from '../../services/VaultService';
import { EcosystemService } from '../../services/EcosystemService';
import { resolveMetricsForYear } from '../../services/ScenarioService';
import { useVaultSessionStore } from '../../store/useVaultSessionStore';
import { useAppStore } from '../../store/useAppStore';
import { useWebGLSupport } from '../../hooks/useWebGLSupport';
import { useAnimatedMetrics } from '../../hooks/useAnimatedMetrics';
import { VaultScene } from '../../components/Vault/VaultScene';
import { VaultLoadingScreen } from '../../components/Vault/VaultLoadingScreen';
import { Vault2DFallback } from '../../components/Vault/Vault2DFallback';
import { Timeline } from '../../components/Timeline/Timeline';
import { ScenarioSwitcher } from '../../components/Timeline/ScenarioSwitcher';
import { ObjectInspector } from '../../components/ObjectInspector/ObjectInspector';
import { BiodiversityPanel } from '../../components/Ecosystem/BiodiversityPanel';
import { CompareView } from '../../components/Comparison/CompareView';
import { StoryModeOverlay } from '../../components/StoryMode/StoryModeOverlay';
import { TakeItOutsidePanel } from '../../components/Vault/TakeItOutsidePanel';
import { NatureWalkModal } from '../../components/Vault/NatureWalkModal';

export function VaultPage() {
  const { ecosystemId } = useParams<{ ecosystemId: string }>();
  const navigate = useNavigate();
  const webglSupported = useWebGLSupport();

  const [isLoading, setIsLoading] = useState(true);
  const [hoveredObjectId, setHoveredObjectId] = useState<string | null>(null);
  const [cameraResetKey, setCameraResetKey] = useState(0);
  const [showTakeItOutside, setShowTakeItOutside] = useState(false);
  const [showNatureWalk, setShowNatureWalk] = useState(false);

  const ecosystem = ecosystemId ? EcosystemService.getById(ecosystemId) : undefined;
  const vault = ecosystemId ? VaultService.getVault(ecosystemId) : undefined;

  const {
    year,
    scenarioId,
    selectedObjectId,
    compareMode,
    isBiodiversityViewOn,
    activeBiodiversityFilter,
    isConnectionsModeOn,
    isStoryModeOn,
    storyChapterIndex,
    setYear,
    setScenarioId,
    selectObject,
    setCompareMode,
    toggleBiodiversityView,
    setBiodiversityFilter,
    toggleConnectionsMode,
    startStoryMode,
    exitStoryMode,
    nextStoryChapter,
    prevStoryChapter,
    resetSession,
  } = useVaultSessionStore();

  const recordVaultVisit = useAppStore((s) => s.recordVaultVisit);
  const recordSpeciesViewed = useAppStore((s) => s.recordSpeciesViewed);
  const markBiodiversityCategoryViewed = useAppStore((s) => s.markBiodiversityCategoryViewed);
  const markStoryCompleted = useAppStore((s) => s.markStoryCompleted);
  const addObservation = useAppStore((s) => s.addObservation);

  // Reset session when the ecosystem changes, and record the visit once loaded.
  useEffect(() => {
    if (!vault) return;
    const [minYear] = VaultService.getMinMaxYear(vault);
    resetSession(minYear);
    setIsLoading(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [vault?.ecosystemId]);

  useEffect(() => {
    if (!isLoading && vault) {
      recordVaultVisit(vault.ecosystemId, year);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoading]);

  const [, maxYear] = useMemo(() => (vault ? VaultService.getMinMaxYear(vault) : [0, 0]), [vault]);

  const rawMetrics = useMemo(() => {
    if (!vault) return { vegetationDensity: 0, waterLevel: 0, biodiversityLevel: 0, developmentLevel: 0 };
    return resolveMetricsForYear(vault.years, year, year === maxYear ? scenarioId : undefined);
  }, [vault, year, scenarioId, maxYear]);

  const metrics = useAnimatedMetrics(rawMetrics);

  const selectedObject = vault?.objects.find((o) => o.id === selectedObjectId) ?? null;

  const handleSelectObject = (id: string) => {
    selectObject(id);
    if (vault) {
      recordSpeciesViewed(vault.ecosystemId, id);
      const object = vault.objects.find((o) => o.id === id);
      if (object) {
        addObservation({
          objectId: id,
          ecosystemId: vault.ecosystemId,
          notes: `Viewed ${object.name}`,
          category: object.biodiversityCategory ?? 'general',
        });
        if (object.biodiversityCategory) markBiodiversityCategoryViewed(object.biodiversityCategory);
      }
    }
  };

  const handleFinishStory = () => {
    if (vault) markStoryCompleted(vault.ecosystemId);
    exitStoryMode();
    setShowTakeItOutside(true);
  };

  if (!ecosystem || !vault) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-vault-charcoal text-vault-offwhite">
        <p className="font-display text-2xl">This vault doesn't exist yet.</p>
        <button
          type="button"
          onClick={() => navigate('/discover')}
          className="mt-4 rounded-full bg-vault-sage px-6 py-2.5 text-sm font-semibold text-vault-forest-deep hover:bg-vault-sage-light"
        >
          Back to Discover
        </button>
      </div>
    );
  }

  if (isLoading) {
    return <VaultLoadingScreen vault={vault} onDone={() => setIsLoading(false)} />;
  }

  if (webglSupported === false) {
    return (
      <div className="fixed inset-0 z-40">
        <div className="glass-panel absolute left-4 top-4 z-30 rounded-xl px-4 py-2">
          <p className="font-display text-sm">{vault.name}</p>
        </div>
        <Vault2DFallback vault={vault} year={year} metrics={metrics} />
        <div className="absolute bottom-4 left-1/2 z-30 -translate-x-1/2">
          <Timeline years={vault.years.map((y) => y.year)} year={year} onChange={setYear} />
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-vault-charcoal">
      <VaultScene
        vault={vault}
        year={year}
        metrics={metrics}
        selectedObjectId={selectedObjectId}
        hoveredObjectId={hoveredObjectId}
        biodiversityFilter={activeBiodiversityFilter}
        onSelect={handleSelectObject}
        onHover={setHoveredObjectId}
        cameraResetKey={cameraResetKey}
      />

      {/* Top-left wordmark + back */}
      <div className="pointer-events-auto absolute left-4 top-4 z-30 flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate('/discover')}
          aria-label="Back to Discover"
          className="glass-panel rounded-full p-2 text-vault-offwhite/80 hover:text-vault-offwhite"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>
        <span className="glass-panel rounded-full px-4 py-2 font-display text-sm tracking-wide">NATUREVAULT</span>
      </div>

      {/* Top-center: timeline + scenario switcher */}
      <div className="pointer-events-auto absolute left-1/2 top-4 z-30 flex -translate-x-1/2 flex-col items-center gap-2">
        <Timeline years={vault.years.map((y) => y.year)} year={year} onChange={setYear} />
        {year === maxYear && <ScenarioSwitcher activeScenarioId={scenarioId} onChange={setScenarioId} />}
      </div>

      {/* Top-right: mode toggles */}
      <div className="pointer-events-auto absolute right-4 top-4 z-30 flex flex-wrap justify-end gap-2">
        <ToggleButton
          label="Biodiversity"
          active={isBiodiversityViewOn}
          onClick={toggleBiodiversityView}
        />
        <ToggleButton label="Story Mode" active={isStoryModeOn} onClick={startStoryMode} />
        <ToggleButton
          label="Compare"
          active={compareMode !== 'off'}
          onClick={() => setCompareMode(compareMode === 'off' ? 'split' : 'off')}
        />
        {compareMode !== 'off' && (
          <div className="glass-panel flex items-center gap-1 rounded-full p-1">
            <button
              type="button"
              onClick={() => setCompareMode('split')}
              className={`rounded-full px-3 py-1 text-xs ${compareMode === 'split' ? 'bg-white/15 text-vault-offwhite' : 'text-vault-offwhite/60'}`}
            >
              Split
            </button>
            <button
              type="button"
              onClick={() => setCompareMode('swipe')}
              className={`rounded-full px-3 py-1 text-xs ${compareMode === 'swipe' ? 'bg-white/15 text-vault-offwhite' : 'text-vault-offwhite/60'}`}
            >
              Swipe
            </button>
          </div>
        )}
      </div>

      {/* Bottom-left: ecosystem label */}
      <div className="pointer-events-none absolute bottom-4 left-4 z-30">
        <div className="glass-panel pointer-events-auto rounded-xl px-4 py-2.5">
          <p className="font-display text-base text-vault-offwhite">{vault.name}</p>
          <p className="text-xs text-vault-sage-light">{ecosystem.typeLabel}</p>
        </div>
      </div>

      {/* Bottom-center: reset camera + take it outside */}
      <div className="pointer-events-auto absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 gap-2">
        <button
          type="button"
          onClick={() => setCameraResetKey((k) => k + 1)}
          className="glass-panel rounded-full px-4 py-2 text-xs font-medium text-vault-offwhite/80 hover:text-vault-offwhite"
        >
          Explore freely
        </button>
        <button
          type="button"
          onClick={() => setShowTakeItOutside(true)}
          className="glass-panel rounded-full px-4 py-2 text-xs font-medium text-vault-gold hover:text-vault-offwhite"
        >
          Take It Outside
        </button>
      </div>

      {/* Bottom-right: interaction hint */}
      <div className="pointer-events-none absolute bottom-4 right-4 z-30">
        <p className="glass-panel rounded-xl px-4 py-2 text-xs text-vault-offwhite/70">
          Click an object to explore
        </p>
      </div>

      {isBiodiversityViewOn && (
        <BiodiversityPanel
          biome={vault}
          year={year}
          activeFilter={activeBiodiversityFilter}
          onSelectFilter={setBiodiversityFilter}
          connectionsOn={isConnectionsModeOn}
          onToggleConnections={toggleConnectionsMode}
        />
      )}

      {selectedObject && (
        <ObjectInspector
          object={selectedObject}
          year={year}
          onClose={() => selectObject(null)}
          showConnections={isConnectionsModeOn}
        />
      )}

      {isStoryModeOn && (
        <StoryModeOverlay
          chapters={vault.storyChapters}
          chapterIndex={storyChapterIndex}
          onNext={() => {
            if (storyChapterIndex === vault.storyChapters.length - 1) {
              handleFinishStory();
            } else {
              const nextChapter = vault.storyChapters[storyChapterIndex + 1];
              if (nextChapter) setYear(nextChapter.year);
              nextStoryChapter(vault.storyChapters.length - 1);
            }
          }}
          onPrev={() => {
            prevStoryChapter();
            const prevChapter = vault.storyChapters[Math.max(storyChapterIndex - 1, 0)];
            if (prevChapter) setYear(prevChapter.year);
          }}
          onExit={handleFinishStory}
        />
      )}

      {compareMode !== 'off' && (
        <CompareView vault={vault} mode={compareMode} onClose={() => setCompareMode('off')} />
      )}

      {showTakeItOutside && (
        <TakeItOutsidePanel
          ecosystem={ecosystem}
          onClose={() => setShowTakeItOutside(false)}
          onStartWalk={() => {
            setShowTakeItOutside(false);
            setShowNatureWalk(true);
          }}
        />
      )}

      {showNatureWalk && <NatureWalkModal onClose={() => setShowNatureWalk(false)} />}
    </div>
  );
}

function ToggleButton({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`glass-panel rounded-full px-4 py-2 text-xs font-medium transition-colors ${
        active ? 'bg-vault-sage/25 text-vault-offwhite' : 'text-vault-offwhite/80 hover:text-vault-offwhite'
      }`}
    >
      {label}
    </button>
  );
}
