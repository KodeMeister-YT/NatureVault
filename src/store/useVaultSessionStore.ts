import { create } from 'zustand';
import type { BiodiversityCategory } from '../types/observation';

export type CompareMode = 'off' | 'split' | 'swipe';

interface VaultSessionState {
  year: number;
  scenarioId: string; // active scenario when year === 2050
  selectedObjectId: string | null;
  compareMode: CompareMode;
  isBiodiversityViewOn: boolean;
  activeBiodiversityFilter: BiodiversityCategory | null;
  isConnectionsModeOn: boolean;
  isStoryModeOn: boolean;
  storyChapterIndex: number;

  setYear: (year: number) => void;
  setScenarioId: (id: string) => void;
  selectObject: (id: string | null) => void;
  setCompareMode: (mode: CompareMode) => void;
  toggleBiodiversityView: () => void;
  setBiodiversityFilter: (category: BiodiversityCategory | null) => void;
  toggleConnectionsMode: () => void;
  startStoryMode: () => void;
  exitStoryMode: () => void;
  nextStoryChapter: (maxIndex: number) => void;
  prevStoryChapter: () => void;
  resetSession: (initialYear: number) => void;
}

export const useVaultSessionStore = create<VaultSessionState>()((set) => ({
  year: 1995,
  scenarioId: 'continue-as-is',
  selectedObjectId: null,
  compareMode: 'off',
  isBiodiversityViewOn: false,
  activeBiodiversityFilter: null,
  isConnectionsModeOn: false,
  isStoryModeOn: false,
  storyChapterIndex: 0,

  setYear: (year) => set({ year, selectedObjectId: null }),
  setScenarioId: (scenarioId) => set({ scenarioId }),
  selectObject: (id) => set({ selectedObjectId: id }),
  setCompareMode: (mode) => set({ compareMode: mode }),
  toggleBiodiversityView: () =>
    set((state) => ({
      isBiodiversityViewOn: !state.isBiodiversityViewOn,
      activeBiodiversityFilter: state.isBiodiversityViewOn ? null : state.activeBiodiversityFilter,
    })),
  setBiodiversityFilter: (category) => set({ activeBiodiversityFilter: category }),
  toggleConnectionsMode: () => set((state) => ({ isConnectionsModeOn: !state.isConnectionsModeOn })),
  startStoryMode: () => set({ isStoryModeOn: true, storyChapterIndex: 0, compareMode: 'off' }),
  exitStoryMode: () => set({ isStoryModeOn: false }),
  nextStoryChapter: (maxIndex) =>
    set((state) => ({ storyChapterIndex: Math.min(state.storyChapterIndex + 1, maxIndex) })),
  prevStoryChapter: () => set((state) => ({ storyChapterIndex: Math.max(state.storyChapterIndex - 1, 0) })),
  resetSession: (initialYear) =>
    set({
      year: initialYear,
      scenarioId: 'continue-as-is',
      selectedObjectId: null,
      compareMode: 'off',
      isBiodiversityViewOn: false,
      activeBiodiversityFilter: null,
      isConnectionsModeOn: false,
      isStoryModeOn: false,
      storyChapterIndex: 0,
    }),
}));
