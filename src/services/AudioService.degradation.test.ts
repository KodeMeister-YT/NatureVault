import { afterEach, describe, expect, it, vi } from 'vitest';

/**
 * Requirement 8.5: if ambient audio fails to initialize (unsupported Web Audio API, or the
 * constructor throws), the system must continue to operate the Vault normally with no
 * functional degradation — `isSupported()` reports `false` and `start()`/`setMuted()` stay
 * safe no-ops rather than throwing.
 *
 * `AudioService`'s support-check result is cached at module scope, so each case below uses
 * `vi.resetModules()` + a dynamic `import()` to get a fresh module instance, avoiding
 * cross-contamination between the "constructor undefined" and "constructor throws" cases.
 */
describe('AudioService graceful degradation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('reports unsupported and stays a safe no-op when window.AudioContext/webkitAudioContext are both undefined', async () => {
    vi.stubGlobal('window', { AudioContext: undefined, webkitAudioContext: undefined });

    vi.resetModules();
    const { AudioService } = await import('./AudioService');

    expect(AudioService.isSupported()).toBe(false);

    expect(() => AudioService.start('desert')).not.toThrow();
    expect(() => AudioService.setMuted(true)).not.toThrow();
  });

  it('reports unsupported and stays a safe no-op when the AudioContext constructor throws', async () => {
    class ThrowingAudioContext {
      constructor() {
        throw new Error('Web Audio API is not available in this environment');
      }
    }
    vi.stubGlobal('window', { AudioContext: ThrowingAudioContext });

    vi.resetModules();
    const { AudioService } = await import('./AudioService');

    expect(AudioService.isSupported()).toBe(false);

    expect(() => AudioService.start('desert')).not.toThrow();
    expect(() => AudioService.setMuted(true)).not.toThrow();
  });
});
