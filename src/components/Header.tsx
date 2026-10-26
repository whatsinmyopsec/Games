import React, { useState, useEffect } from 'react';
import { Flame, ExternalLink, Download, Sparkles, HardDrive, Cpu, Music, Gamepad2, Eye, Zap, RefreshCw, CheckCircle2 } from 'lucide-react';
import { TORCHBOUND_STATS } from '../data/torchboundData';
import { DUNGEN_DOOM_STATS } from '../data/dungenDoomData';

export const Header: React.FC = () => {
  const [liveVersion, setLiveVersion] = useState<string>(TORCHBOUND_STATS.version);
  const [isCheckingVersion, setIsCheckingVersion] = useState<boolean>(false);
  const [lastChecked, setLastChecked] = useState<string>('Just now');

  const checkLiveVersion = async () => {
    setIsCheckingVersion(true);
    try {
      const res = await fetch('https://torchbound-duk.pages.dev/version.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (data.version) {
          setLiveVersion(data.version);
        }
      }
    } catch {
      // Fallback to static
    } finally {
      setIsCheckingVersion(false);
      setLastChecked(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }
  };

  useEffect(() => {
    checkLiveVersion();
    // Poll every 3 minutes while page is open
    const interval = setInterval(checkLiveVersion, 180000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header className="relative border-b border-amber-900/40 bg-radial from-amber-950/30 via-stone-950 to-stone-950 pb-8 pt-8">
      {/* Ambient background torch glow */}
      <div className="pointer-events-none absolute left-1/2 top-0 h-64 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-600/10 blur-3xl" />
      
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/50 px-3 py-1 text-xs font-mono text-amber-300">
                <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                <span>CASE STUDY: MICRO-GAME ARCHITECTURE &amp; EXTREME MINIATURIZATION</span>
              </div>

              {/* Live Version Tracked Indicator */}
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-950/40 px-2.5 py-1 text-[11px] font-mono text-emerald-300">
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                <span>Official Release Tracked: v{liveVersion} &middot; Daily Reset: 00:00 UTC</span>
                <button
                  onClick={checkLiveVersion}
                  className="hover:text-emerald-100 ml-1 cursor-pointer"
                  title={`Click to re-verify live release (Checked: ${lastChecked})`}
                >
                  <RefreshCw className={`h-3 w-3 ${isCheckingVersion ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-100 font-serif">
              How Are These Games <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-rose-400">So Tiny?</span>
            </h1>

            <p className="max-w-3xl text-stone-300 text-sm sm:text-base leading-relaxed">
              While modern PC titles demand 50 GB to 150 GB of disk space and even simple indie games balloon past 500 MB due to engine bloat, web masterpieces like <strong className="text-amber-300 font-semibold">Torchbound</strong> (now just <strong>{TORCHBOUND_STATS.downloadZipSizeMB} MB zip</strong> in v{liveVersion}) and <strong className="text-rose-300 font-semibold">Dungen Doom</strong> (3D FPS, {DUNGEN_DOOM_STATS.bundleGzipKB} KB JS transfer) deliver complete multiplayer and retro 3D experiences in the space of a single photo. How is this possible?
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 self-start md:self-center shrink-0">
            <a
              href="https://torchbound-duk.pages.dev/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-amber-500/40 bg-amber-600/20 px-4 py-2.5 text-sm font-medium text-amber-200 hover:bg-amber-600/30 hover:border-amber-400 transition shadow-lg shadow-amber-950/40"
            >
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Download Torchbound v{liveVersion} ({TORCHBOUND_STATS.downloadZipSizeMB}MB Zip)</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>

            <a
              href="https://kivylius.com/games/dungen-doom/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-lg border border-rose-500/40 bg-rose-600/20 px-4 py-2.5 text-sm font-medium text-rose-200 hover:bg-rose-600/30 hover:border-rose-400 transition shadow-lg shadow-rose-950/40"
            >
              <Eye className="h-4 w-4 text-rose-400" />
              <span>Dungen Doom ({DUNGEN_DOOM_STATS.bundleGzipKB}KB)</span>
              <ExternalLink className="h-3.5 w-3.5 opacity-70" />
            </a>
          </div>
        </div>

        {/* Quick Cross-Game KPI ticker */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Torchbound Download</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-amber-200 font-mono">{TORCHBOUND_STATS.downloadZipSizeMB} MB Zip</div>
            <div className="text-[11px] text-emerald-400 mt-0.5">{TORCHBOUND_STATS.optimizationDropPercentage}</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Eye className="h-4 w-4 text-rose-400" />
              <span>Dungen Doom 3D</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-rose-300 font-mono">{DUNGEN_DOOM_STATS.bundleGzipKB} KB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">{DUNGEN_DOOM_STATS.bundleSizeMB} MB JS (Gzip)</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Cpu className="h-4 w-4 text-emerald-400" />
              <span>Texture Files Shipped</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-emerald-300 font-mono">0 Bytes</div>
            <div className="text-[11px] text-stone-400 mt-0.5">100% procedural Canvas in memory</div>
          </div>

          <div className="rounded-xl border border-stone-800 bg-stone-900/60 p-3.5 backdrop-blur">
            <div className="flex items-center gap-2 text-stone-400 text-xs font-mono">
              <Zap className="h-4 w-4 text-purple-400" />
              <span>Engine Overhead</span>
            </div>
            <div className="mt-1 text-2xl font-bold text-purple-300 font-mono">0 – 1.15 MB</div>
            <div className="text-[11px] text-stone-400 mt-0.5">Neutralino / PWA vs 180MB Electron</div>
          </div>
        </div>
      </div>
    </header>
  );
};
