import React, { useState } from 'react';
import { 
  DUNGEN_DOOM_STATS, 
  DUNGEN_DOOM_BREAKDOWN, 
  DUNGEN_DOOM_PILLARS, 
  COMPARISON_TABLE 
} from '../data/dungenDoomData';
import { DungenDoomSandbox } from './DungenDoomSandbox';
import { 
  Gamepad2, 
  ExternalLink, 
  Layers, 
  Cpu, 
  Sparkles, 
  Zap, 
  SlidersHorizontal, 
  HardDrive,
  FileCode,
  ShieldCheck,
  Scale
} from 'lucide-react';

export const DungenDoomView: React.FC = () => {
  const [selectedAsset, setSelectedAsset] = useState<string>(DUNGEN_DOOM_BREAKDOWN[0].name);
  const [activePillarId, setActivePillarId] = useState<string>(DUNGEN_DOOM_PILLARS[0].id);

  const activePillar = DUNGEN_DOOM_PILLARS.find(p => p.id === activePillarId) || DUNGEN_DOOM_PILLARS[0];
  const activeAsset = DUNGEN_DOOM_BREAKDOWN.find(a => a.name === selectedAsset) || DUNGEN_DOOM_BREAKDOWN[0];

  const totalRawBytes = DUNGEN_DOOM_BREAKDOWN.reduce((acc, a) => acc + a.rawSizeBytes, 0);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Hero Banner for Dungen Doom */}
      <div className="relative rounded-2xl border border-rose-900/40 bg-radial from-rose-950/40 via-stone-950 to-stone-950 p-6 sm:p-8 overflow-hidden shadow-2xl">
        <div className="pointer-events-none absolute right-0 top-0 h-64 w-96 rounded-full bg-rose-600/10 blur-3xl" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-rose-500/30 bg-rose-950/60 px-3 py-1 text-xs font-mono text-rose-300">
              <Gamepad2 className="h-3.5 w-3.5 text-rose-400" />
              <span>CASE STUDY: DUNGEN DOOM (KIVYLIUS)</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-100 font-serif">
              How Does a 3D Retro FPS Fit in <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 via-amber-300 to-yellow-400">357 KB?</span>
            </h2>

            <p className="max-w-2xl text-stone-300 text-sm sm:text-base leading-relaxed">
              At <code className="text-rose-300 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800 text-xs">kivylius.com/games/dungen-doom/</code>, players enter a complete 3D retro dungeon crawler with first-person perspective, raycasted physics, monster AI, shotgun combat, and dynamic torch illumination—yet the entire network transfer weighs <strong className="text-rose-400 font-semibold">less than 360 KB</strong>.
            </p>
          </div>

          <a
            href="https://kivylius.com/games/dungen-doom/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-500/40 bg-rose-600/20 px-4 py-2.5 text-sm font-medium text-rose-200 hover:bg-rose-600/30 hover:border-rose-400 transition shadow-lg shadow-rose-950/40 self-start md:self-center shrink-0"
          >
            <span>Play Dungen Doom Online</span>
            <ExternalLink className="h-4 w-4 opacity-80" />
          </a>
        </div>

        {/* Dungen Doom KPI Grid */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Zap className="h-4 w-4 text-rose-400" />
              <span>Network Transfer</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-rose-300 font-mono">357 KB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Gzip transfer size</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Cpu className="h-4 w-4 text-amber-400" />
              <span>Uncompressed JS</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-300 font-mono">1.22 MB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Three.js + game + generator</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Sparkles className="h-4 w-4 text-emerald-400" />
              <span>External 3D Models</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-300 font-mono">0 Bytes</div>
            <div className="text-[11px] text-stone-400 mt-0.5">All 3D geometry is procedural</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Layers className="h-4 w-4 text-cyan-400" />
              <span>Texture Atlases</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-cyan-300 font-mono">0 Bytes</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Procedural CanvasTextures</div>
          </div>
        </div>
      </div>

      {/* Playable 3D Engine Sandbox */}
      <DungenDoomSandbox />

      {/* 4 Architectural Pillars of Dungen Doom */}
      <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="h-5 w-5 text-rose-400" />
              <h3 className="text-xl font-bold text-stone-100 font-serif">
                The 4 Architectural Secrets of Dungen Doom
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              How Kivylius bypassed standard 3D game engine bloat to fit a 3D FPS into 357 KB
            </p>
          </div>
        </div>

        {/* Tab Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {DUNGEN_DOOM_PILLARS.map(p => {
            const isActive = p.id === activePillarId;
            return (
              <button
                key={p.id}
                onClick={() => setActivePillarId(p.id)}
                className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 cursor-pointer ${
                  isActive 
                    ? 'bg-rose-950/60 border-rose-500/60 shadow-lg shadow-rose-950/50' 
                    : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/40 text-stone-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wide">
                    {p.tag}
                  </span>
                  <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50">
                    {p.savedMegabytes}
                  </span>
                </div>
                <h4 className={`text-xs font-bold leading-tight mt-0.5 ${isActive ? 'text-rose-200' : 'text-stone-300'}`}>
                  {p.title}
                </h4>
              </button>
            );
          })}
        </div>

        {/* Selected Pillar Card */}
        <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
            <div>
              <span className="text-xs font-mono text-rose-400 font-medium tracking-wide">
                {activePillar.tag}
              </span>
              <h4 className="text-lg font-bold text-stone-100 font-serif">
                {activePillar.headline}
              </h4>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-mono font-semibold text-emerald-300">
              <Zap className="h-3.5 w-3.5 text-emerald-400" />
              <span>{activePillar.savedMegabytes}</span>
            </div>
          </div>

          <p className="text-sm text-stone-300 leading-relaxed">
            {activePillar.description}
          </p>

          <div className="space-y-2">
            <span className="text-xs font-mono uppercase tracking-wider text-rose-300 font-semibold block">
              Technical Implementation Details:
            </span>
            <ul className="grid sm:grid-cols-2 gap-2 text-xs text-stone-300">
              {activePillar.mechanics.map((step, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-800 text-[10px] font-mono text-rose-400">
                    {idx + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Bundle Anatomy of Dungen Doom */}
      <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
          <HardDrive className="h-5 w-5 text-rose-400" />
          <h3 className="text-xl font-bold text-stone-100 font-serif">
            Byte Breakdown: Inside the 1.22 MB JavaScript Bundle
          </h3>
        </div>

        {/* Visual Bar */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs text-stone-400 font-mono">
            <span>JavaScript Module Distribution</span>
            <span>Total: {(totalRawBytes / (1024 * 1024)).toFixed(2)} MB Uncompressed</span>
          </div>

          <div className="flex h-10 w-full overflow-hidden rounded-xl border border-stone-800 bg-stone-950 p-1 gap-1">
            {DUNGEN_DOOM_BREAKDOWN.map(asset => {
              const pct = (asset.rawSizeBytes / totalRawBytes) * 100;
              const isSelected = selectedAsset === asset.name;
              return (
                <button
                  key={asset.name}
                  onClick={() => setSelectedAsset(asset.name)}
                  style={{ width: `${pct}%` }}
                  className={`h-full rounded-lg transition-all relative flex items-center justify-center border text-[11px] font-bold overflow-hidden cursor-pointer ${
                    isSelected ? 'ring-2 ring-white z-10' : 'opacity-85 hover:opacity-100'
                  } ${
                    asset.category === 'threejs' ? 'bg-rose-500/80 border-rose-400 text-stone-950' :
                    asset.category === 'engine' ? 'bg-amber-500/80 border-amber-400 text-stone-950' :
                    asset.category === 'textures' ? 'bg-emerald-500/80 border-emerald-400 text-stone-950' :
                    'bg-cyan-500/80 border-cyan-400 text-stone-950'
                  }`}
                >
                  <span className="truncate px-1 hidden sm:inline">{pct > 12 ? asset.name.split(' ')[0] : ''}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected Asset Details */}
        {activeAsset && (
          <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-2">
            <div className="flex items-center justify-between border-b border-stone-800 pb-2">
              <h4 className="font-mono font-semibold text-stone-100 text-sm">{activeAsset.name}</h4>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono font-bold text-rose-300 bg-rose-950/40 border border-rose-900/60 px-2.5 py-0.5 rounded-md">
                  Raw: {(activeAsset.rawSizeBytes / 1024).toFixed(0)} KB &middot; Gzip: {(activeAsset.gzipSizeBytes / 1024).toFixed(0)} KB
                </span>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              {activeAsset.description}
            </p>
          </div>
        )}
      </section>

      {/* Side-by-Side Comparison: Torchbound vs Dungen Doom */}
      <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
        <div className="flex items-center gap-2 border-b border-stone-800 pb-4">
          <Scale className="h-5 w-5 text-amber-400" />
          <div>
            <h3 className="text-xl font-bold text-stone-100 font-serif">
              Torchbound vs. Dungen Doom: Two Masters of Miniaturization
            </h3>
            <p className="text-xs text-stone-400 mt-0.5">
              Comparing 2D top-down canvas architecture against 3D WebGL retro raycasting
            </p>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-stone-800">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-950/90 text-stone-400 font-mono uppercase tracking-wider border-b border-stone-800">
              <tr>
                <th className="py-3 px-4">Architectural Dimension</th>
                <th className="py-3 px-4 text-amber-300">Torchbound (2D Top-Down)</th>
                <th className="py-3 px-4 text-rose-300">Dungen Doom (3D Retro FPS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-800/50 bg-stone-900/30">
              {COMPARISON_TABLE.map((row, idx) => (
                <tr key={idx} className="hover:bg-stone-800/40 transition">
                  <td className="py-3 px-4 font-mono font-semibold text-stone-300">
                    {row.dimension}
                  </td>
                  <td className="py-3 px-4 text-stone-300 leading-relaxed">
                    {row.torchbound}
                  </td>
                  <td className="py-3 px-4 text-stone-300 leading-relaxed">
                    {row.dungenDoom}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
