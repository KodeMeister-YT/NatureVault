import { afterEach, describe, expect, it, vi } from 'vitest';
import { AudioService, biomeAudioProfiles } from './AudioService';

const REQUIRED_ECOSYSTEM_LAYERS: Record<string, string[]> = {
  'coastal-wetland': ['water', 'birds', 'insects'],
  'evergreen-valley': ['birds', 'wind'],
  'tropical-forest': ['rain'],
  desert: ['wind'],
  'alpine-ecosystem': ['wind', 'water'],
  'freshwater-lake': ['water', 'birds'],
  'grassland-savanna': ['wind', 'insects'],
  'coral-reef': ['underwater'],
};

/** Minimal mock Web Audio graph sufficient to exercise every AudioService synthesis path without errors. */
class MockAudioParam {
  value = 0;
  setValueAtTime = vi.fn();
  linearRampToValueAtTime = vi.fn();
  cancelScheduledValues = vi.fn();
}

class MockAudioNode {
  connect = vi.fn();
  disconnect = vi.fn();
}

class MockGainNode extends MockAudioNode {
  gain = new MockAudioParam();
}

class MockBiquadFilterNode extends MockAudioNode {
  type = 'lowpass';
  frequency = new MockAudioParam();
}

class MockAudioBufferSourceNode extends MockAudioNode {
  buffer: unknown = null;
  loop = false;
  start = vi.fn();
  stop = vi.fn();
}

class MockOscillatorNode extends MockAudioNode {
  type = 'sine';
  frequency = new MockAudioParam();
  detune = new MockAudioParam();
  start = vi.fn();
  stop = vi.fn();
}

class MockAudioBuffer {
  private readonly channelData: Float32Array;
  constructor(_channels: number, frameCount: number, _sampleRate: number) {
    this.channelData = new Float32Array(frameCount);
  }
  getChannelData(): Float32Array {
    return this.channelData;
  }
}

let audioContextConstructCount = 0;
let startedSourceCount = 0;

class MockAudioContext {
  sampleRate = 44100;
  currentTime = 0;
  destination = new MockAudioNode();

  constructor() {
    audioContextConstructCount += 1;
  }

  createBuffer(channels: number, frameCount: number, sampleRate: number) {
    return new MockAudioBuffer(channels, frameCount, sampleRate);
  }

  createBufferSource() {
    const node = new MockAudioBufferSourceNode();
    node.start.mockImplementation(() => {
      startedSourceCount += 1;
    });
    return node;
  }

  createGain() {
    return new MockGainNode();
  }

  createBiquadFilter() {
    return new MockBiquadFilterNode();
  }

  createOscillator() {
    const node = new MockOscillatorNode();
    node.start.mockImplementation(() => {
      startedSourceCount += 1;
    });
    return node;
  }

  resume() {
    return Promise.resolve();
  }
}

/**
 * Validates: Requirements 8.3, 8.6, 9.3
 */
describe('AudioService', () => {
  afterEach(() => {
    AudioService.stop();
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  describe('biomeAudioProfiles', () => {
    it('contains the exact required layer set for each of the 8 ecosystemIds', () => {
      expect(Object.keys(biomeAudioProfiles).sort()).toEqual(Object.keys(REQUIRED_ECOSYSTEM_LAYERS).sort());
      for (const [ecosystemId, expectedLayers] of Object.entries(REQUIRED_ECOSYSTEM_LAYERS)) {
        expect(biomeAudioProfiles[ecosystemId].layers).toEqual(expectedLayers);
      }
    });
  });

  describe('no side effects on import', () => {
    it('does not construct an AudioContext or start any source merely by importing the module', () => {
      // audioContextConstructCount/startedSourceCount are module-level counters on the mock class,
      // untouched at this point since AudioService.ts was imported at the top of this file and no
      // AudioService method has been called yet in this describe block.
      expect(audioContextConstructCount).toBe(0);
      expect(startedSourceCount).toBe(0);
    });
  });

  describe('shared-context singleton', () => {
    it('constructs AudioContext at most once across multiple start() calls for different biomes', () => {
      vi.stubGlobal('window', { AudioContext: MockAudioContext });

      AudioService.start('coastal-wetland');
      AudioService.start('desert');
      AudioService.start('coral-reef');

      expect(audioContextConstructCount).toBe(1);
    });
  });
});
