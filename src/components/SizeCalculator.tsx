import React, { useState } from 'react';
import { Sliders, RotateCcw, AlertTriangle, CheckCircle, Sparkles } from 'lucide-react';

export const SizeCalculator: React.FC = () => {
  // Choices
  const [engine, setEngine] = useState<'neutralino' | 'tauri' | 'godot' | 'unity' | 'electron'>('neutralino');
  const [audio, setAudio] = useState<'procedural' | 'compressed' | 'uncompressed'>('procedural');
  const [art, setArt] = useState<'rle' | 'png' | 'hires'>('rle');
  const [maps, setMaps] = useState<'prng' | 'baked'>('prng');
  const [cutscenes, setCutscenes] = useState<'torchbound_mp4' | 'none' | 'cgi'>('torchbound_mp4');

  // Weights in MB
  const engineWeights = {
    neutralino: 2.7,
    tauri: 12.0,
    godot: 45.0,
    unity: 110.0,
    electron: 180.0,
  };

  const audioWeights = {
    procedural: 0.0,
    compressed: 45.0,
    uncompressed: 220.0,
  };

  const artWeights = {
    rle: 0.4,
    png: 35.0,
    hires: 350.0,
  };

  const mapWeights = {
    prng: 0.02,
    baked: 28.0,
  };

  const cutsceneWeights = {
    none: 0.0,
    torchbound_mp4: 12.3,
    cgi: 650.0,
  };

  const totalSizeMB = 
    engineWeights[engine] + 
    audioWeights[audio] + 
    artWeights[art] + 
    mapWeights[maps] + 
    cutsceneWeights[cutscenes];

  const resetToTorchbound = () => {
    setEngine('neutralino');
    setAudio('procedural');
    setArt('rle');
    setMaps('prng');
    setCutscenes('torchbound_mp4');
  };

  const resetToConvention = () => {
    setEngine('electron');
    setAudio('compressed');
    setArt('png');
    setMaps('baked');
    setCutscenes('torchbound_mp4');
  };

  const isPureTorchbound = 
    engine === 'neutralino' && 
    audio === 'procedural' && 
    art === 'rle' && 
    maps === 'prng';

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Interactive Game Size Simulator
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Toggle architectural decisions to see how normal development habits bloat games to hundreds of megabytes
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={resetToTorchbound}
            className="px-3 py-1.5 rounded-lg border border-amber-600/40 bg-amber-950/40 text-amber-300 hover:bg-amber-900/40 text-xs font-mono transition cursor-pointer"
          >
            Torchbound Preset (15 MB)
          </button>
          <button
            onClick={resetToConvention}
            className="px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 text-xs font-mono transition cursor-pointer"
          >
            Standard Indie Preset (280 MB)
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Sliders / Option Selectors */}
        <div className="lg:col-span-8 space-y-5">
          {/* 1. Engine */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-300 font-semibold">1. Desktop Engine / Runtime Wrapper:</span>
              <span className="text-amber-400 font-bold">+{engineWeights[engine]} MB</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {[
                { id: 'neutralino', label: 'Neutralinojs (2.7 MB)', badge: 'Torchbound' },
                { id: 'tauri', label: 'Tauri (12 MB)', badge: 'Rust' },
                { id: 'godot', label: 'Godot (45 MB)', badge: 'Lightweight' },
                { id: 'unity', label: 'Unity 2D (110 MB)', badge: 'Standard' },
                { id: 'electron', label: 'Electron (180 MB)', badge: 'Chromium' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setEngine(opt.id as typeof engine)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    engine === opt.id 
                      ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold' 
                      : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="text-[10px] text-stone-400 font-mono">{opt.badge}</span>
                  <span className="mt-1 font-mono">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Audio */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-300 font-semibold">2. Sound Effects & Music Pipeline:</span>
              <span className="text-amber-400 font-bold">+{audioWeights[audio]} MB</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'procedural', label: 'Procedural Web Audio (0 MB)', badge: 'Torchbound (Real-time Math)' },
                { id: 'compressed', label: 'Compressed OGG / MP3 (45 MB)', badge: 'Typical Indie Games' },
                { id: 'uncompressed', label: 'Uncompressed WAV / PCM (220 MB)', badge: 'Audiophile / Heavy SFX' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setAudio(opt.id as typeof audio)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    audio === opt.id 
                      ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold' 
                      : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="text-[10px] text-stone-400 font-mono">{opt.badge}</span>
                  <span className="mt-1 font-mono">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Art & Sprites */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-300 font-semibold">3. Graphics & Spritesheet Encoding:</span>
              <span className="text-amber-400 font-bold">+{artWeights[art]} MB</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'rle', label: 'Base64 RLE + Color Math (0.4 MB)', badge: 'Torchbound (Packed string)' },
                { id: 'png', label: 'PNG Atlases & Spritesheets (35 MB)', badge: 'Standard 2D Textures' },
                { id: 'hires', label: 'High-Res 2D / Normal Maps (350 MB)', badge: 'Heavy Visual Assets' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setArt(opt.id as typeof art)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    art === opt.id 
                      ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold' 
                      : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="text-[10px] text-stone-400 font-mono">{opt.badge}</span>
                  <span className="mt-1 font-mono">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Maps & World */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-300 font-semibold">4. World & Dungeon Architecture:</span>
              <span className="text-amber-400 font-bold">+{mapWeights[maps]} MB</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                { id: 'prng', label: 'Seeded PRNG Math (0.02 MB)', badge: 'Torchbound (Infinite procedural rooms)' },
                { id: 'baked', label: 'Pre-baked Tilemap JSONs (28 MB)', badge: 'Static levels and scene graph files' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setMaps(opt.id as typeof maps)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    maps === opt.id 
                      ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold' 
                      : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="text-[10px] text-stone-400 font-mono">{opt.badge}</span>
                  <span className="mt-1 font-mono">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 5. Cutscenes */}
          <div className="space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-stone-300 font-semibold">5. Video Cutscenes:</span>
              <span className="text-amber-400 font-bold">+{cutsceneWeights[cutscenes]} MB</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { id: 'none', label: 'No Cutscenes (0 MB)', badge: 'Pure Micro-Game' },
                { id: 'torchbound_mp4', label: '2 Compressed MP4s (12.3 MB)', badge: 'Torchbound Desktop Zip' },
                { id: 'cgi', label: 'Pre-rendered CGI Cinematic (650 MB)', badge: 'AAA Style Video' },
              ].map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCutscenes(opt.id as typeof cutscenes)}
                  className={`p-2.5 rounded-xl border text-left text-xs transition cursor-pointer flex flex-col justify-between ${
                    cutscenes === opt.id 
                      ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold' 
                      : 'bg-stone-950/50 border-stone-800 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <span className="text-[10px] text-stone-400 font-mono">{opt.badge}</span>
                  <span className="mt-1 font-mono">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Live Size Gauge (Right Column) */}
        <div className="lg:col-span-4 rounded-xl border border-stone-800 bg-stone-950/90 p-5 space-y-5 sticky top-6 shadow-2xl">
          <div className="text-center space-y-1 border-b border-stone-800 pb-4">
            <span className="text-xs font-mono uppercase tracking-wider text-stone-400">
              Total Projected Download Size
            </span>
            <div className="text-4xl font-extrabold font-mono text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 mt-1">
              {totalSizeMB < 10 ? totalSizeMB.toFixed(2) : totalSizeMB.toFixed(1)} MB
            </div>
            <span className="text-[11px] font-mono text-stone-400 block">
              {totalSizeMB > 150 ? '⚠️ High Bloat (Typical Electron/Unity Game)' : '⚡ Ultra-Lean Game Architecture'}
            </span>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <span className="text-[10px] uppercase tracking-wider text-stone-400 block font-semibold">
              Weight Breakdown:
            </span>
            <div className="flex justify-between text-stone-300">
              <span>Engine Binary:</span>
              <span className="text-amber-400">{engineWeights[engine]} MB</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Audio Data:</span>
              <span className="text-cyan-400">{audioWeights[audio]} MB</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Graphics / Sprites:</span>
              <span className="text-emerald-400">{artWeights[art]} MB</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Dungeon Maps:</span>
              <span className="text-purple-400">{mapWeights[maps]} MB</span>
            </div>
            <div className="flex justify-between text-stone-300">
              <span>Video Cutscene:</span>
              <span className="text-amber-400">{cutsceneWeights[cutscenes]} MB</span>
            </div>
          </div>

          {/* Verdict callout */}
          <div className={`p-3 rounded-lg border text-xs ${
            isPureTorchbound
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200'
              : 'bg-stone-900 border-stone-800 text-stone-300'
          }`}>
            {isPureTorchbound ? (
              <div className="flex items-start gap-2">
                <Sparkles className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                <p>
                  <strong>Exact Torchbound Configuration!</strong> Using OS WebView2, procedural Web Audio, and RLE base64 sprites, the game fits entirely in <strong>15 MB (or 1.4 MB without video)</strong>.
                </p>
              </div>
            ) : (
              <p>
                Switching away from procedural techniques adds <strong>{(totalSizeMB - 15.4).toFixed(1)} MB</strong> of file bloat.
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
