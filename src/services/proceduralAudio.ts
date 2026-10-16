/**
 * Procedural Web Audio Synthesizer
 * Demonstrates how Torchbound generates sound effects and music arpeggios
 * entirely from mathematical formulas without shipping a single .wav or .mp3 file!
 */

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  return audioCtx;
}

export type SoundEffectType = 'torch' | 'slash' | 'monster' | 'coin' | 'crystal' | 'footstep' | 'ambient';

export interface SoundProfile {
  id: SoundEffectType;
  name: string;
  category: string;
  mathDescription: string;
  conventionalFileSize: string;
  torchboundSize: string;
}

export const SOUND_PROFILES: SoundProfile[] = [
  {
    id: 'torch',
    name: 'Torch Ignition & Flicker',
    category: 'Atmosphere',
    mathDescription: 'Bandpass filtered white noise burst with exponential decay + low sine pop',
    conventionalFileSize: '~250 KB (WAV)',
    torchboundSize: '0 Bytes',
  },
  {
    id: 'slash',
    name: 'Sword Slash',
    category: 'Combat',
    mathDescription: 'Sawtooth oscillator sweeping 700Hz -> 90Hz in 120ms with lowpass envelope',
    conventionalFileSize: '~180 KB (WAV)',
    torchboundSize: '0 Bytes',
  },
  {
    id: 'monster',
    name: 'Dungeon Beast Growl',
    category: 'Enemies',
    mathDescription: 'FM synthesis: 65Hz carrier modulated by 12Hz sine with distortion waveshaper',
    conventionalFileSize: '~450 KB (WAV)',
    torchboundSize: '0 Bytes',
  },
  {
    id: 'coin',
    name: 'Loot Gold Coin',
    category: 'Inventory',
    mathDescription: 'Dual pure sine tones at 987Hz (B5) and 1318Hz (E6) with rapid decay',
    conventionalFileSize: '~90 KB (WAV)',
    torchboundSize: '0 Bytes',
  },
  {
    id: 'crystal',
    name: 'Mana Crystal Shimmer',
    category: 'Magic',
    mathDescription: 'Chime arpeggio of 3 staggered harmonics (1760Hz, 2637Hz, 3520Hz) with reverb ping',
    conventionalFileSize: '~380 KB (WAV)',
    torchboundSize: '0 Bytes',
  },
  {
    id: 'footstep',
    name: 'Stone Footstep',
    category: 'Movement',
    mathDescription: '25ms burst of low-passed pink noise with quadratic damping',
    conventionalFileSize: '~75 KB (WAV)',
    torchboundSize: '0 Bytes',
  },
  {
    id: 'ambient',
    name: 'Dungeon Catacomb Hum',
    category: 'Ambience',
    mathDescription: 'Dual detuned triangle waves (55Hz / 57Hz) with LFO resonant filter sweep',
    conventionalFileSize: '~1.8 MB (OGG loop)',
    torchboundSize: '0 Bytes',
  },
];

export function playProceduralSound(type: SoundEffectType): { duration: number; formula: string } {
  const ctx = getAudioContext();
  const now = ctx.currentTime;

  switch (type) {
    case 'torch': {
      // Noise burst for flame whoosh
      const bufferSize = ctx.sampleRate * 0.4;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(320, now);
      filter.Q.setValueAtTime(3.0, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.01, now);
      gain.gain.exponentialRampToValueAtTime(0.5, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.38);

      // Low thump
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(45, now + 0.15);
      oscGain.gain.setValueAtTime(0.4, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.4);
      osc.start(now);
      osc.stop(now + 0.16);

      return {
        duration: 0.4,
        formula: 'NoiseBuffer * Bandpass(320Hz, Q=3) * ExpDecay(0.38s) + Sine(140Hz -> 45Hz)',
      };
    }

    case 'slash': {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      const filter = ctx.createBiquadFilter();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(750, now);
      osc.frequency.exponentialRampToValueAtTime(80, now + 0.14);

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(2200, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.14);

      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.16);

      return {
        duration: 0.16,
        formula: 'Sawtooth(750Hz -> 80Hz) * Lowpass(2.2kHz -> 300Hz) * ExpDecay(150ms)',
      };
    }

    case 'monster': {
      // FM modulation
      const carrier = ctx.createOscillator();
      const modulator = ctx.createOscillator();
      const modGain = ctx.createGain();
      const masterGain = ctx.createGain();

      carrier.type = 'sawtooth';
      carrier.frequency.setValueAtTime(70, now);
      carrier.frequency.linearRampToValueAtTime(50, now + 0.4);

      modulator.type = 'sine';
      modulator.frequency.setValueAtTime(14, now);

      modGain.gain.setValueAtTime(80, now);
      modGain.gain.linearRampToValueAtTime(20, now + 0.4);

      modulator.connect(modGain);
      modGain.connect(carrier.frequency);

      masterGain.gain.setValueAtTime(0.3, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      carrier.connect(masterGain);
      masterGain.connect(ctx.destination);

      modulator.start(now);
      carrier.start(now);
      modulator.stop(now + 0.46);
      carrier.stop(now + 0.46);

      return {
        duration: 0.45,
        formula: 'Carrier: Sawtooth(70Hz -> 50Hz) + FM Modulator: Sine(14Hz, Index: 80 -> 20)',
      };
    }

    case 'coin': {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, now); // B5
      osc1.frequency.setValueAtTime(1318.51, now + 0.06); // E6

      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1975.53, now); // B6 overtone
      osc2.frequency.setValueAtTime(2637.02, now + 0.06);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 0.36);
      osc2.stop(now + 0.36);

      return {
        duration: 0.35,
        formula: 'Dual Arpeggio Sine(B5=988Hz @ 0ms, E6=1319Hz @ 60ms) + Triangle 2nd Harmonic',
      };
    }

    case 'crystal': {
      const freqs = [1760, 2200, 2640, 3520];
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(0.15, now);
      masterGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      masterGain.connect(ctx.destination);

      freqs.forEach((f, idx) => {
        const osc = ctx.createOscillator();
        const g = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, now + idx * 0.05);

        g.gain.setValueAtTime(0.2, now + idx * 0.05);
        g.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

        osc.connect(g);
        g.connect(masterGain);

        osc.start(now + idx * 0.05);
        osc.stop(now + 0.75);
      });

      return {
        duration: 0.8,
        formula: 'Polyphonic Shimmer: [1760Hz, 2200Hz, 2640Hz, 3520Hz] staggered by 50ms',
      };
    }

    case 'footstep': {
      const bufferSize = Math.floor(ctx.sampleRate * 0.07);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(380, now);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.07);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start(now);
      noise.stop(now + 0.08);

      return {
        duration: 0.08,
        formula: '70ms Damped Noise * Lowpass(380Hz) * Quadratic Attenuation',
      };
    }

    case 'ambient': {
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const filter = ctx.createBiquadFilter();
      const gain = ctx.createGain();

      osc1.type = 'triangle';
      osc1.frequency.setValueAtTime(55, now); // A1 sub-bass

      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(55.8, now); // slightly detuned for deep binaural beating

      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(180, now);
      filter.frequency.linearRampToValueAtTime(320, now + 1.2);
      filter.frequency.linearRampToValueAtTime(140, now + 2.5);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.25, now + 0.3);
      gain.gain.linearRampToValueAtTime(0.001, now + 2.5);

      osc1.connect(filter);
      osc2.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);
      osc1.stop(now + 2.6);
      osc2.stop(now + 2.6);

      return {
        duration: 2.5,
        formula: 'Detuned Low Oscs (55.0Hz + 55.8Hz) * Dynamic Lowpass Filter (180Hz <-> 320Hz)',
      };
    }
  }
}
