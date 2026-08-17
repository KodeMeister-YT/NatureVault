import { seededRange } from '../utils/seededRandom';

export type AudioLayerKind = 'wind' | 'birds' | 'water' | 'insects' | 'rain' | 'underwater';

export interface BiomeAudioProfile {
  layers: AudioLayerKind[];
}

/** Per-`ecosystemId` ambient layer mix (Requirement 8.3). */
export const biomeAudioProfiles: Record<string, BiomeAudioProfile> = {
  'coastal-wetland': { layers: ['water', 'birds', 'insects'] },
  'evergreen-valley': { layers: ['birds', 'wind'] },
  'tropical-forest': { layers: ['rain'] }, // "rainforest ambience" per Requirement 8.3
  desert: { layers: ['wind'] },
  'alpine-ecosystem': { layers: ['wind', 'water'] },
  'freshwater-lake': { layers: ['water', 'birds'] },
  'grassland-savanna': { layers: ['wind', 'insects'] },
  'coral-reef': { layers: ['underwater'] },
};

interface LayerHandle {
  gainNode: GainNode;
  dispose: () => void;
}

type AudioContextConstructor = new () => AudioContext;

interface WindowWithWebkitAudio {
  AudioContext?: AudioContextConstructor;
  webkitAudioContext?: AudioContextConstructor;
}

function resolveAudioContextConstructor(): AudioContextConstructor | undefined {
  if (typeof window === 'undefined') return undefined;
  const w = window as unknown as WindowWithWebkitAudio;
  return w.AudioContext ?? w.webkitAudioContext;
}

/** Generates a short (~2s) white-noise buffer used as the raw source for every filtered-noise layer. */
function createNoiseBuffer(context: AudioContext): AudioBuffer {
  const durationSeconds = 2;
  const frameCount = Math.max(1, Math.floor(context.sampleRate * durationSeconds));
  const buffer = context.createBuffer(1, frameCount, context.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < frameCount; i += 1) {
    data[i] = Math.random() * 2 - 1;
  }
  return buffer;
}

interface FilteredNoiseOptions {
  highpassFreq?: number;
  lowpassFreq?: number;
  baseGain: number;
}

/** wind/rain/underwater: looping filtered white noise through a biquad filter chain. */
function createFilteredNoiseLayer(context: AudioContext, options: FilteredNoiseOptions): LayerHandle {
  const source = context.createBufferSource();
  source.buffer = createNoiseBuffer(context);
  source.loop = true;

  const chainNodes: AudioNode[] = [source];
  let current: AudioNode = source;

  if (options.highpassFreq !== undefined) {
    const highpass = context.createBiquadFilter();
    highpass.type = 'highpass';
    highpass.frequency.value = options.highpassFreq;
    current.connect(highpass);
    current = highpass;
    chainNodes.push(highpass);
  }

  if (options.lowpassFreq !== undefined) {
    const lowpass = context.createBiquadFilter();
    lowpass.type = 'lowpass';
    lowpass.frequency.value = options.lowpassFreq;
    current.connect(lowpass);
    current = lowpass;
    chainNodes.push(lowpass);
  }

  const gainNode = context.createGain();
  gainNode.gain.value = options.baseGain;
  current.connect(gainNode);
  chainNodes.push(gainNode);

  source.start();

  return {
    gainNode,
    dispose: () => {
      try {
        source.stop();
      } catch {
        // already stopped
      }
      for (const node of chainNodes) node.disconnect();
    },
  };
}

/** water: filtered noise with a slow LFO modulating the lowpass cutoff, for a bubbling/flowing quality. */
function createWaterLayer(context: AudioContext): LayerHandle {
  const source = context.createBufferSource();
  source.buffer = createNoiseBuffer(context);
  source.loop = true;

  const lowpass = context.createBiquadFilter();
  lowpass.type = 'lowpass';
  lowpass.frequency.value = 500;

  const lfo = context.createOscillator();
  lfo.frequency.value = 0.15;
  const lfoDepth = context.createGain();
  lfoDepth.gain.value = 220;
  lfo.connect(lfoDepth);
  lfoDepth.connect(lowpass.frequency);

  const gainNode = context.createGain();
  gainNode.gain.value = 0.2;

  source.connect(lowpass);
  lowpass.connect(gainNode);

  source.start();
  lfo.start();

  return {
    gainNode,
    dispose: () => {
      try {
        source.stop();
      } catch {
        // already stopped
      }
      try {
        lfo.stop();
      } catch {
        // already stopped
      }
      source.disconnect();
      lowpass.disconnect();
      lfo.disconnect();
      lfoDepth.disconnect();
      gainNode.disconnect();
    },
  };
}

interface ChirpVoice {
  oscillator: OscillatorNode;
  envelope: GainNode;
  index: number;
}

/**
 * birds/insects: a small pool of detuned oscillators with gain envelopes that key on/off at
 * randomized intervals via setTimeout-scheduled gain ramps (simple chirp effect). Uses
 * seededRange for timing so behavior is reproducible-but-varied rather than flaky in tests.
 */
function createChirpLayer(context: AudioContext, kind: 'birds' | 'insects', seed: number): LayerHandle {
  const gainNode = context.createGain();
  gainNode.gain.value = kind === 'birds' ? 0.18 : 0.12;

  const poolSize = kind === 'birds' ? 3 : 4;
  const freqRange: [number, number] = kind === 'birds' ? [1800, 4200] : [3000, 6500];
  const chirpDurationSeconds = kind === 'birds' ? 0.18 : 0.08;
  const intervalRangeMs: [number, number] = kind === 'birds' ? [900, 3200] : [300, 1400];

  let disposed = false;
  const timeouts: ReturnType<typeof setTimeout>[] = [];

  const pool: ChirpVoice[] = Array.from({ length: poolSize }, (_, index) => {
    const oscillator = context.createOscillator();
    oscillator.type = kind === 'birds' ? 'sine' : 'square';
    oscillator.frequency.value = seededRange(seed + index * 17, freqRange[0], freqRange[1]);
    oscillator.detune.value = seededRange(seed + index * 29, -30, 30);
    const envelope = context.createGain();
    envelope.gain.value = 0;
    oscillator.connect(envelope);
    envelope.connect(gainNode);
    oscillator.start();
    return { oscillator, envelope, index };
  });

  function scheduleVoice(voice: ChirpVoice, tick: number): void {
    if (disposed) return;
    const delayMs = seededRange(seed + voice.index * 41 + tick * 7, intervalRangeMs[0], intervalRangeMs[1]);
    const handle = setTimeout(() => {
      if (disposed) return;
      const now = context.currentTime;
      voice.envelope.gain.cancelScheduledValues(now);
      voice.envelope.gain.setValueAtTime(0, now);
      voice.envelope.gain.linearRampToValueAtTime(1, now + chirpDurationSeconds * 0.25);
      voice.envelope.gain.linearRampToValueAtTime(0, now + chirpDurationSeconds);
      scheduleVoice(voice, tick + 1);
    }, delayMs);
    timeouts.push(handle);
  }

  for (const voice of pool) scheduleVoice(voice, 0);

  return {
    gainNode,
    dispose: () => {
      disposed = true;
      for (const handle of timeouts) clearTimeout(handle);
      for (const voice of pool) {
        try {
          voice.oscillator.stop();
        } catch {
          // already stopped
        }
        voice.oscillator.disconnect();
        voice.envelope.disconnect();
      }
      gainNode.disconnect();
    },
  };
}

function createLayer(context: AudioContext, kind: AudioLayerKind, index: number): LayerHandle {
  const seed = (index + 1) * 977;
  switch (kind) {
    case 'wind':
      return createFilteredNoiseLayer(context, { lowpassFreq: 500, baseGain: 0.22 });
    case 'rain':
      return createFilteredNoiseLayer(context, { highpassFreq: 1500, lowpassFreq: 7000, baseGain: 0.15 });
    case 'underwater':
      return createFilteredNoiseLayer(context, { lowpassFreq: 200, baseGain: 0.18 });
    case 'water':
      return createWaterLayer(context);
    case 'birds':
      return createChirpLayer(context, 'birds', seed);
    case 'insects':
      return createChirpLayer(context, 'insects', seed);
    default: {
      const exhaustiveCheck: never = kind;
      throw new Error(`Unhandled audio layer kind: ${String(exhaustiveCheck)}`);
    }
  }
}

// ---- Session-level shared state (module-scoped; nothing here runs until a method is called) ----

let cachedSupported: boolean | null = null;
let sharedContext: AudioContext | null = null;
let muteGainNode: GainNode | null = null;
let mutedState = true;

let currentEcosystemId: string | null = null;
let currentLayers: LayerHandle[] = [];
let currentMasterGain: GainNode | null = null;

/** Lazily creates the one shared AudioContext for the session (Requirement 9.3). Only invoked from a public method call, never on import. */
function ensureSharedContext(): AudioContext | null {
  if (cachedSupported === false) return null;
  if (sharedContext) return sharedContext;

  try {
    const Ctor = resolveAudioContextConstructor();
    if (!Ctor) {
      cachedSupported = false;
      return null;
    }
    const context = new Ctor();
    const muteGain = context.createGain();
    muteGain.gain.value = mutedState ? 0 : 1;
    muteGain.connect(context.destination);

    sharedContext = context;
    muteGainNode = muteGain;
    cachedSupported = true;
    return context;
  } catch {
    cachedSupported = false;
    sharedContext = null;
    muteGainNode = null;
    return null;
  }
}

function teardownCurrentBiome(): void {
  for (const layer of currentLayers) layer.dispose();
  currentLayers = [];
  if (currentMasterGain) {
    currentMasterGain.disconnect();
    currentMasterGain = null;
  }
  currentEcosystemId = null;
}

export const AudioService = {
  /** Checked once and cached — not re-checked per call (Requirement 8.5). */
  isSupported(): boolean {
    if (cachedSupported !== null) return cachedSupported;
    return ensureSharedContext() !== null;
  },

  /**
   * Lazily creates one shared AudioContext for the session (Requirement 9.3). Never called on
   * import — must be explicitly invoked by a caller in response to a user gesture (Requirement 8.6).
   * Idempotent per ecosystem: calling again for the currently-running ecosystem is a no-op.
   * Tears down the previous biome's layers before building the new biome's.
   */
  start(ecosystemId: string): void {
    const context = ensureSharedContext();
    if (!context || !muteGainNode) return;

    if (currentEcosystemId === ecosystemId && currentMasterGain) return;

    teardownCurrentBiome();
    context.resume().catch(() => {
      // Autoplay-policy rejection: stay silent, no error surfaced to the user (Requirement 8.5).
    });

    const profile = biomeAudioProfiles[ecosystemId];
    if (!profile) {
      currentEcosystemId = ecosystemId;
      return;
    }

    const masterGain = context.createGain();
    masterGain.gain.value = 1;
    masterGain.connect(muteGainNode);

    const layers = profile.layers.map((kind, index) => createLayer(context, kind, index));
    for (const layer of layers) layer.gainNode.connect(masterGain);

    currentEcosystemId = ecosystemId;
    currentMasterGain = masterGain;
    currentLayers = layers;
  },

  /** Tears down the currently-playing biome's audio graph. Safe no-op if nothing is playing or unsupported. */
  stop(): void {
    if (!sharedContext) return;
    teardownCurrentBiome();
  },

  /** Instantaneous global mute via a single gain gate — no graph teardown/rebuild needed (Requirement 8.4). */
  setMuted(muted: boolean): void {
    mutedState = muted;
    if (muteGainNode) {
      muteGainNode.gain.value = muted ? 0 : 1;
    }
  },

  isMuted(): boolean {
    return mutedState;
  },
};
