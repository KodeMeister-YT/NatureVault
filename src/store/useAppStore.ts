import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Observation, BiodiversityCategory } from '../types/observation';

export interface ExploredEcosystem {
  ecosystemId: string;
  timesExplored: number;
  lastYearViewed: number;
  speciesViewedIds: string[];
}

interface AppState {
  // Demo mode
  isDemoMode: boolean;
  startDemoMode: () => void;
  exitDemoMode: () => void;

  // My Vault / exploration tracking
  exploredEcosystems: Record<string, ExploredEcosystem>;
  recordVaultVisit: (ecosystemId: string, year: number) => void;
  recordSpeciesViewed: (ecosystemId: string, objectId: string) => void;

  // Observations (object clicks / discoveries)
  observations: Observation[];
  addObservation: (obs: Omit<Observation, 'id' | 'timestamp'>) => void;

  // Conservation actions learned (impact tracking)
  conservationActionsLearned: string[];
  markConservationActionLearned: (actionId: string) => void;

  // Biodiversity filter viewed categories (for impact stats)
  biodiversityCategoriesViewed: BiodiversityCategory[];
  markBiodiversityCategoryViewed: (category: BiodiversityCategory) => void;

  // Story mode completion
  storiesCompleted: string[];
  markStoryCompleted: (ecosystemId: string) => void;

  // Nature walks completed
  natureWalksCompleted: number;
  incrementNatureWalksCompleted: () => void;

  // Ambient audio mute state (persisted across navigation, Requirement 8.4)
  isAudioMuted: boolean;
  setAudioMuted: (muted: boolean) => void;

  // Reset (used when exiting demo mode to avoid polluting real data)
  resetProgress: () => void;
}

const initialProgressState = {
  exploredEcosystems: {} as Record<string, ExploredEcosystem>,
  observations: [] as Observation[],
  conservationActionsLearned: [] as string[],
  biodiversityCategoriesViewed: [] as BiodiversityCategory[],
  storiesCompleted: [] as string[],
  natureWalksCompleted: 0,
};

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      isDemoMode: false,
      startDemoMode: () => set({ isDemoMode: true, ...initialProgressState }),
      exitDemoMode: () => set({ isDemoMode: false, ...initialProgressState }),

      ...initialProgressState,

      isAudioMuted: true,
      setAudioMuted: (muted) => set({ isAudioMuted: muted }),

      recordVaultVisit: (ecosystemId, year) =>
        set((state) => {
          const existing = state.exploredEcosystems[ecosystemId];
          return {
            exploredEcosystems: {
              ...state.exploredEcosystems,
              [ecosystemId]: existing
                ? { ...existing, timesExplored: existing.timesExplored + 1, lastYearViewed: year }
                : { ecosystemId, timesExplored: 1, lastYearViewed: year, speciesViewedIds: [] },
            },
          };
        }),

      recordSpeciesViewed: (ecosystemId, objectId) =>
        set((state) => {
          const existing = state.exploredEcosystems[ecosystemId];
          if (!existing) {
            return {
              exploredEcosystems: {
                ...state.exploredEcosystems,
                [ecosystemId]: {
                  ecosystemId,
                  timesExplored: 1,
                  lastYearViewed: 0,
                  speciesViewedIds: [objectId],
                },
              },
            };
          }
          if (existing.speciesViewedIds.includes(objectId)) return {};
          return {
            exploredEcosystems: {
              ...state.exploredEcosystems,
              [ecosystemId]: {
                ...existing,
                speciesViewedIds: [...existing.speciesViewedIds, objectId],
              },
            },
          };
        }),

      addObservation: (obs) =>
        set((state) => ({
          observations: [
            ...state.observations,
            { ...obs, id: `obs-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, timestamp: Date.now() },
          ],
        })),

      markConservationActionLearned: (actionId) =>
        set((state) =>
          state.conservationActionsLearned.includes(actionId)
            ? {}
            : { conservationActionsLearned: [...state.conservationActionsLearned, actionId] },
        ),

      markBiodiversityCategoryViewed: (category) =>
        set((state) =>
          state.biodiversityCategoriesViewed.includes(category)
            ? {}
            : { biodiversityCategoriesViewed: [...state.biodiversityCategoriesViewed, category] },
        ),

      markStoryCompleted: (ecosystemId) =>
        set((state) =>
          state.storiesCompleted.includes(ecosystemId)
            ? {}
            : { storiesCompleted: [...state.storiesCompleted, ecosystemId] },
        ),

      incrementNatureWalksCompleted: () =>
        set((state) => ({ natureWalksCompleted: state.natureWalksCompleted + 1 })),

      resetProgress: () => set({ ...initialProgressState }),
    }),
    {
      name: 'naturevault-store',
      partialize: (state) => ({
        isDemoMode: state.isDemoMode,
        exploredEcosystems: state.exploredEcosystems,
        observations: state.observations,
        conservationActionsLearned: state.conservationActionsLearned,
        biodiversityCategoriesViewed: state.biodiversityCategoriesViewed,
        storiesCompleted: state.storiesCompleted,
        natureWalksCompleted: state.natureWalksCompleted,
        isAudioMuted: state.isAudioMuted,
      }),
    },
  ),
);
