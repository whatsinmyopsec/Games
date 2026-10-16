import React from 'react';
import { Flame, ExternalLink, Download, Sparkles, HardDrive, Cpu, Music } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="relative border-b border-amber-900/40 bg-radial from-amber-950/30 via-stone-950 to-stone-950 pb-8 pt-8">
      {/* Ambient background torch glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/50 px-3 py-1 text-xs font-mono text-amber-300">
              <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>CASE STUDY: TORCHBOUND ARCHITECTURE</span>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-100 font-serif">
              Why Is This Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500">So Tiny?</span>
            </h1>

            <p className="max-w-2xl text-stone-300 text-sm sm:text-base leading-relaxed">
              When players visit <code className="text-amber-300 bg-stone-900 px-1.5 py-0.5 rounded border border-stone-800 text-xs">torchbound-duk.pages.dev/download/</code>, they see a complete co-op dungeon crawl RPG packaged as a 
              <strong className="text-amber-400 font-semibold"> 13.2 MB zip</strong>. Stripped of two video cutscenes, the playable game logic, bosses, audio, and graphics weigh <strong className="text-amber-400 font-semibold">just 1.01 MB</strong>.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-start md:self-center">
            <a
              href="https://torchbound-duk.pages.dev/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-600/20 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-600/30 hover:border-amber-400 transition shadow-lg shadow-amber-950/40"
            >
              <Download className="h-4 w-4 text-amber-400" />
              <span>View Target Download</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>

            <a
              href="https://torchbound-duk.pages.dev/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-stone-800 bg-stone-900/80 px-4 py-2.5 text-sm font-medium text-stone-300 hover:bg-stone-800 transition"
            >
              <span>Play Web Version</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Quick KPI ticker */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <HardDrive className="h-4 w-4 text-amber-400" />
              <span>Full Windows Zip</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-200 font-mono">13.2 MB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">89% is MP4 video cutscenes</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>Game Core (game.html)</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-300 font-mono">1.01 MB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">~298 KB gzipped over CDN</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Music className="h-4 w-4 text-cyan-400" />
              <span>Shipped Audio Files</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-cyan-300 font-mono">0 Bytes</div>
            <div className="text-[11px] text-stone-400 mt-0.5">100% procedural Web Audio</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Sparkles className="h-4 w-4 text-purple-400" />
              <span>Engine Overhead</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-300 font-mono">1.15 MB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Neutralinojs vs 180MB Electron</div>
          </div>
        </div>
      </div>
    </header>
  );
};
