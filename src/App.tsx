import React, { useState } from 'react';
import { Header } from './components/Header';
import { ZipInspector } from './components/ZipInspector';
import { PillarsGrid } from './components/PillarsGrid';
import { AudioSynthesizerLab } from './components/AudioSynthesizerLab';
import { DungeonLightingSandbox } from './components/DungeonLightingSandbox';
import { EngineComparison } from './components/EngineComparison';
import { SourceCodeInspector } from './components/SourceCodeInspector';
import { SizeCalculator } from './components/SizeCalculator';
import { DungenDoomView } from './components/DungenDoomView';
import { 
  Flame, 
  Layers, 
  SlidersHorizontal, 
  Volume2, 
  Gamepad2, 
  Scale, 
  Code, 
  Sliders, 
  CheckCircle2, 
  ExternalLink, 
  Sparkles,
  Eye,
  Zap
} from 'lucide-react';

export default function App() {
  const [selectedGame, setSelectedGame] = useState<'torchbound' | 'dungen-doom'>('torchbound');
  const [activeTab, setActiveTab] = useState<'all' | 'zip' | 'pillars' | 'audio' | 'sandbox' | 'engine' | 'code' | 'calculator'>('all');

  const torchboundNavItems = [
    { id: 'all', label: 'Complete Overview', icon: <Flame className="h-4 w-4" /> },
    { id: 'zip', label: '13.2MB Zip Anatomy', icon: <Layers className="h-4 w-4" /> },
    { id: 'pillars', label: '5 Core Pillars', icon: <SlidersHorizontal className="h-4 w-4" /> },
    { id: 'audio', label: 'Procedural Audio Lab', icon: <Volume2 className="h-4 w-4" /> },
    { id: 'sandbox', label: 'Playable Lighting Sandbox', icon: <Gamepad2 className="h-4 w-4" /> },
    { id: 'engine', label: 'Engine Benchmark', icon: <Scale className="h-4 w-4" /> },
    { id: 'code', label: 'Source Code Secrets', icon: <Code className="h-4 w-4" /> },
    { id: 'calculator', label: 'Game Size Simulator', icon: <Sliders className="h-4 w-4" /> },
  ];

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 selection:bg-amber-500 selection:text-stone-950">
      <Header />

      {/* Primary Game Selector Bar */}
      <section className="border-b border-stone-800 bg-stone-900/60 sticky top-0 z-50 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-stone-400 uppercase tracking-wider hidden sm:inline">
                Select Case Study:
              </span>
              <div className="inline-flex p-1 rounded-xl bg-stone-950 border border-stone-800">
                <button
                  onClick={() => setSelectedGame('torchbound')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    selectedGame === 'torchbound'
                      ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-950/50'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Flame className="h-4 w-4" />
                  <span>1. Torchbound (2D RPG &middot; 13.2MB / 1.01MB)</span>
                </button>

                <button
                  onClick={() => setSelectedGame('dungen-doom')}
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
                    selectedGame === 'dungen-doom'
                      ? 'bg-rose-500 text-stone-950 shadow-md shadow-rose-950/50'
                      : 'text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Eye className="h-4 w-4" />
                  <span>2. Dungen Doom (3D Retro FPS &middot; 357KB)</span>
                </button>
              </div>
            </div>

            <div className="text-[11px] font-mono text-stone-400 hidden lg:flex items-center gap-3">
              <span className="flex items-center gap-1.5 text-amber-300">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>Torchbound: 1.01MB Engine</span>
              </span>
              <span>&middot;</span>
              <span className="flex items-center gap-1.5 text-rose-300">
                <Zap className="h-3.5 w-3.5 text-rose-400" />
                <span>Dungen Doom: 357KB 3D FPS</span>
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* GAME 1: TORCHBOUND VIEW */}
      {selectedGame === 'torchbound' && (
        <>
          {/* Executive Answer Callout */}
          <section className="border-b border-stone-800 bg-stone-900/40">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
              <div className="rounded-2xl border border-amber-500/40 bg-radial from-amber-950/40 to-stone-950 p-6 space-y-4">
                <div className="flex items-center gap-2 text-amber-400 font-mono text-xs font-semibold uppercase tracking-wider">
                  <CheckCircle2 className="h-4 w-4 text-amber-400" />
                  <span>Direct Answer: How Torchbound Fits In Just 13 Megabytes</span>
                </div>

                <div className="grid md:grid-cols-3 gap-4 text-xs sm:text-sm text-stone-300">
                  <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 space-y-1.5">
                    <span className="font-mono text-amber-300 font-bold block text-sm">
                      1. 89% Is Just Video Cutscenes
                    </span>
                    <p className="text-stone-400 leading-relaxed">
                      Of the 13.2 MB zip, <strong>12.3 MB is two MP4 video cutscenes</strong> (<code className="text-stone-300 font-mono">intro.mp4</code>). 
                      The entire game program itself is <strong>only 1.01 MB</strong>.
                    </p>
                  </div>

                  <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 space-y-1.5">
                    <span className="font-mono text-amber-300 font-bold block text-sm">
                      2. Neutralinojs instead of Electron
                    </span>
                    <p className="text-stone-400 leading-relaxed">
                      Torchbound does not package Google Chrome. It uses <strong>Neutralinojs</strong> with the user&apos;s existing <strong>Microsoft Edge WebView2</strong>, keeping the executable at just <strong>1.15 MB compressed</strong> instead of 180 MB.
                    </p>
                  </div>

                  <div className="bg-stone-900/80 p-4 rounded-xl border border-stone-800 space-y-1.5">
                    <span className="font-mono text-amber-300 font-bold block text-sm">
                      3. 100% Procedural Generation
                    </span>
                    <p className="text-stone-400 leading-relaxed">
                      <strong>Zero sound files</strong> (Web Audio synthesizes all sounds mathematically), <strong>zero pre-baked levels</strong> (Mulberry32 PRNG carves maps), and <strong>compact RLE spritesheets</strong>.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Sub Navigation Bar for Torchbound Sections */}
          <nav className="border-b border-stone-800/80 bg-stone-950/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex space-x-1 overflow-x-auto py-2.5 no-scrollbar">
                {torchboundNavItems.map(item => {
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => setActiveTab(item.id as typeof activeTab)}
                      className={`inline-flex items-center gap-2 whitespace-nowrap rounded-lg px-3.5 py-1.5 text-xs font-mono font-medium transition cursor-pointer ${
                        isActive
                          ? 'bg-amber-500 text-stone-950 font-bold shadow-md shadow-amber-950/50'
                          : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                      }`}
                    >
                      {item.icon}
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </nav>

          {/* Main Torchbound Content Area */}
          <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
            {(activeTab === 'all' || activeTab === 'zip') && <ZipInspector />}
            {(activeTab === 'all' || activeTab === 'pillars') && <PillarsGrid />}
            {(activeTab === 'all' || activeTab === 'audio') && <AudioSynthesizerLab />}
            {(activeTab === 'all' || activeTab === 'sandbox') && <DungeonLightingSandbox />}
            {(activeTab === 'all' || activeTab === 'engine') && <EngineComparison />}
            {(activeTab === 'all' || activeTab === 'code') && <SourceCodeInspector />}
            {(activeTab === 'all' || activeTab === 'calculator') && <SizeCalculator />}
          </main>
        </>
      )}

      {/* GAME 2: DUNGEN DOOM VIEW */}
      {selectedGame === 'dungen-doom' && (
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <DungenDoomView />
        </main>
      )}

      {/* Universal Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-10 text-stone-500 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="font-mono text-stone-300">Micro-Game Architecture Deconstruction</span>
            <span>&middot;</span>
            <span>Torchbound &amp; Dungen Doom</span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <a
              href="https://torchbound-duk.pages.dev/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition flex items-center gap-1"
            >
              <span>Torchbound</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://kivylius.com/games/dungen-doom/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-rose-400 transition flex items-center gap-1"
            >
              <span>Dungen Doom</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://github.com/whatsinmyopsec/Games"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-stone-300 transition flex items-center gap-1"
            >
              <span>GitHub Repo</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
