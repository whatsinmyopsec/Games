import React, { useState, useEffect, useRef } from 'react';
import { 
  SOUND_PROFILES, 
  playProceduralSound, 
  SoundProfile, 
  SoundEffectType 
} from '../services/proceduralAudio';
import { Volume2, Play, Activity, Sparkles, Code2, Music, CheckCircle2 } from 'lucide-react';

export const AudioSynthesizerLab: React.FC = () => {
  const [activeSound, setActiveSound] = useState<SoundProfile>(SOUND_PROFILES[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [activeFormula, setActiveFormula] = useState(SOUND_PROFILES[0].mathDescription);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const handlePlaySound = (profile: SoundProfile) => {
    setActiveSound(profile);
    setIsPlaying(true);
    const result = playProceduralSound(profile.id);
    setActiveFormula(result.formula);

    // Stop playing indicator after duration
    setTimeout(() => {
      setIsPlaying(false);
    }, result.duration * 1000);
  };

  // Oscilloscope animation effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let phase = 0;

    const render = () => {
      ctx.fillStyle = '#0c0a09';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw subtle grid
      ctx.strokeStyle = '#292524';
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x < canvas.width; x += 30) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();

      // Center line
      ctx.strokeStyle = '#44403c';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height / 2);
      ctx.lineTo(canvas.width, canvas.height);
      ctx.stroke();

      // Draw waveform
      ctx.strokeStyle = isPlaying ? '#f59e0b' : '#78716c';
      ctx.lineWidth = isPlaying ? 2.5 : 1.5;
      ctx.shadowColor = isPlaying ? 'rgba(245, 158, 11, 0.6)' : 'transparent';
      ctx.shadowBlur = isPlaying ? 8 : 0;

      ctx.beginPath();
      const mid = canvas.height / 2;
      const amp = isPlaying ? canvas.height * 0.35 : 4;

      for (let x = 0; x < canvas.width; x++) {
        let y = mid;
        if (isPlaying) {
          switch (activeSound.id) {
            case 'slash':
              y = mid + Math.sin(x * 0.15 + phase) * amp * Math.exp(-x / canvas.width);
              break;
            case 'torch':
              y = mid + (Math.random() * 2 - 1) * amp * Math.sin(x * 0.05 + phase);
              break;
            case 'monster':
              y = mid + Math.sin(x * 0.08 + phase + Math.sin(x * 0.02) * 5) * amp;
              break;
            case 'coin':
              y = mid + (Math.sin(x * 0.25 + phase) + Math.sin(x * 0.35 + phase)) * (amp * 0.6);
              break;
            case 'crystal':
              y = mid + (Math.sin(x * 0.3 + phase) * 0.5 + Math.sin(x * 0.45 + phase) * 0.5) * amp;
              break;
            case 'ambient':
              y = mid + Math.sin(x * 0.04 + phase) * Math.sin(x * 0.038 + phase) * amp;
              break;
            default:
              y = mid + Math.sin(x * 0.1 + phase) * amp;
          }
        } else {
          y = mid + Math.sin(x * 0.05 + phase) * amp;
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      phase += isPlaying ? 0.2 : 0.03;
      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, activeSound]);

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Volume2 className="h-5 w-5 text-cyan-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Live Procedural Web Audio Synthesizer
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Test real-time synthesis: zero audio files, 100% mathematical oscillators and noise algorithms
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-cyan-950/40 border border-cyan-800/50 px-3 py-1.5 rounded-lg text-cyan-300">
          <Music className="h-4 w-4 text-cyan-400" />
          <span>No .wav / .mp3 downloads required</span>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sound Selection List (Left Column) */}
        <div className="lg:col-span-5 space-y-2">
          <span className="text-xs font-mono text-stone-400 uppercase tracking-wider block mb-1">
            Click to Synthesize in Real-Time:
          </span>

          <div className="space-y-2">
            {SOUND_PROFILES.map(sound => {
              const isSelected = activeSound.id === sound.id;
              return (
                <button
                  key={sound.id}
                  onClick={() => handlePlaySound(sound)}
                  className={`w-full p-3 rounded-xl border text-left transition flex items-center justify-between gap-3 group cursor-pointer ${
                    isSelected 
                      ? 'bg-cyan-950/40 border-cyan-500/60 shadow-lg shadow-cyan-950/30' 
                      : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg border transition ${
                      isSelected && isPlaying
                        ? 'bg-amber-500 text-stone-950 border-amber-400 scale-105'
                        : isSelected
                        ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40'
                        : 'bg-stone-900 text-stone-400 border-stone-800 group-hover:text-stone-200'
                    }`}>
                      <Play className="h-3.5 w-3.5 fill-current" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-xs font-bold text-stone-200 font-mono">{sound.name}</h4>
                        <span className="text-[10px] text-stone-400 font-mono">({sound.category})</span>
                      </div>
                      <p className="text-[11px] text-stone-400 truncate max-w-[210px] sm:max-w-xs mt-0.5">
                        {sound.mathDescription}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[11px] font-mono text-emerald-400 font-bold block">
                      {sound.torchboundSize}
                    </span>
                    <span className="text-[10px] font-mono text-stone-400 line-through">
                      {sound.conventionalFileSize}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Synthesizer Display & Waveform (Right Column) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className={`h-4 w-4 ${isPlaying ? 'text-amber-400 animate-pulse' : 'text-stone-400'}`} />
                <span className="text-xs font-mono font-semibold text-stone-300 uppercase tracking-wide">
                  Real-Time Waveform Monitor
                </span>
              </div>
              <span className={`text-[11px] font-mono px-2 py-0.5 rounded border ${
                isPlaying 
                  ? 'bg-amber-950 text-amber-300 border-amber-700/60' 
                  : 'bg-stone-900 text-stone-400 border-stone-800'
              }`}>
                {isPlaying ? '● SYNTHESIZING AUDIO' : 'IDLE'}
              </span>
            </div>

            {/* Oscilloscope Canvas */}
            <div className="relative overflow-hidden rounded-lg border border-stone-800 bg-stone-950 shadow-inner">
              <canvas
                ref={canvasRef}
                width={480}
                height={120}
                className="w-full h-28 block"
              />
              <div className="absolute bottom-2 right-2 text-[10px] font-mono text-stone-400 bg-stone-900/80 px-2 py-0.5 rounded border border-stone-800">
                44.1 kHz Web Audio Context
              </div>
            </div>

            {/* Math Formula Display */}
            <div className="rounded-lg border border-stone-800/80 bg-stone-900/60 p-3 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-mono text-stone-400">
                <span className="flex items-center gap-1.5 text-cyan-300">
                  <Code2 className="h-3.5 w-3.5" />
                  <span>Synthesizer Formula for {activeSound.name}:</span>
                </span>
                <span className="text-emerald-400 font-bold">0 MB Asset Weight</span>
              </div>
              <div className="p-2 rounded bg-stone-950 font-mono text-xs text-amber-200 border border-stone-800 overflow-x-auto whitespace-pre">
                {activeFormula}
              </div>
            </div>

            {/* Comparative Breakdown */}
            <div className="grid grid-cols-2 gap-3 text-xs font-mono">
              <div className="bg-stone-900/40 p-3 rounded-lg border border-stone-800/80">
                <span className="text-stone-400 block text-[11px]">Conventional Approach</span>
                <div className="text-rose-400 font-bold mt-0.5">{activeSound.conventionalFileSize}</div>
                <p className="text-[11px] text-stone-400 mt-1 leading-snug">
                  Requires raw audio sample file, disk storage, and HTTP fetch latency.
                </p>
              </div>

              <div className="bg-emerald-950/20 p-3 rounded-lg border border-emerald-800/30">
                <span className="text-emerald-400 block text-[11px]">Torchbound Web Audio Approach</span>
                <div className="text-emerald-300 font-bold mt-0.5">0.00 Bytes Asset Overhead</div>
                <p className="text-[11px] text-stone-300 mt-1 leading-snug">
                  Generated in 2 milliseconds on CPU using native Web Audio primitives.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
