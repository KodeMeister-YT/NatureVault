import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Requirement 8.4: the ambient-audio mute state (`isAudioMuted`) must persist across
 * navigation/reloads via `useAppStore`'s zustand `persist` middleware.
 *
 * `useAppStore.ts` reads `window.localStorage` at *module import time* (inside the
 * `persist` middleware's default storage factory), and this test file runs under the
 * `node` vitest environment (see `vitest.config.ts`), where `window` does not exist as a
 * global by default. So each case here stubs a minimal in-memory `localStorage` on
 * `window` *before* dynamically importing a fresh copy of the module, following the same
 * `vi.resetModules()` + dynamic-import pattern used by `AudioService.degradation.test.ts`
 * to avoid cross-test module-state contamination and to guarantee the stub is in place
 * before the persist middleware's default options are evaluated.
 */
function createMockLocalStorage() {
  const data = new Map<string, string>();
  return {
    getItem: (key: string) => (data.has(key) ? (data.get(key) as string) : null),
    setItem: (key: string, value: string) => {
      data.set(key, value);
    },
    removeItem: (key: string) => {
      data.delete(key);
    },
    clear: () => data.clear(),
  };
}

describe('useAppStore audio-mute persistence (Requirement 8.4)', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('defaults isAudioMuted to true when nothing has been persisted yet', async () => {
    vi.stubGlobal('window', { localStorage: createMockLocalStorage() });
    vi.resetModules();
    const { useAppStore } = await import('./useAppStore');

    expect(useAppStore.getState().isAudioMuted).toBe(true);
  });

  it('persists the toggled isAudioMuted value into localStorage under the store key', async () => {
    const localStorage = createMockLocalStorage();
    vi.stubGlobal('window', { localStorage });
    vi.resetModules();
    const { useAppStore } = await import('./useAppStore');

    useAppStore.getState().setAudioMuted(false);

    expect(useAppStore.getState().isAudioMuted).toBe(false);

    const raw = localStorage.getItem('naturevault-store');
    expect(raw).not.toBeNull();
    const persisted = JSON.parse(raw as string);
    expect(persisted.state.isAudioMuted).toBe(false);
  });

  it('reflects the persisted isAudioMuted value across a simulated navigation (module re-import)', async () => {
    const localStorage = createMockLocalStorage();
    vi.stubGlobal('window', { localStorage });
    vi.resetModules();
    const first = await import('./useAppStore');
    first.useAppStore.getState().setAudioMuted(false);

    // Simulate navigating to a new route / reloading by re-importing a fresh module
    // instance, which re-hydrates from the same (stubbed) localStorage backing store.
    vi.resetModules();
    const second = await import('./useAppStore');

    expect(second.useAppStore.getState().isAudioMuted).toBe(false);
  });
});
