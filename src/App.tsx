import React, { useState } from 'react';
import { Header } from './components/Header';
import { ZipInspector } from './components/ZipInspector';
import { PillarsGrid } from './components/PillarsGrid';
import { AudioSynthesizerLab } from './components/AudioSynthesizerLab';
import { DungeonLightingSandbox } from './components/DungeonLightingSandbox';
import { EngineComparison } from './components/EngineComparison';
import { SourceCodeInspector } from './components/SourceCodeInspector';
import { SizeCalculator } from './components/SizeCalculator';
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
  ChevronRight
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'all' | 'zip' | 'pillars' | 'audio' | 'sandbox' | 'engine' | 'code' | 'calculator'>('all');

  const navItems = [
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

      {/* Navigation Filter Bar */}
      <nav className="sticky top-0 z-40 border-b border-stone-800/80 bg-stone-950/90 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-1 overflow-x-auto py-2.5 no-scrollbar">
            {navItems.map(item => {
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

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        {(activeTab === 'all' || activeTab === 'zip') && <ZipInspector />}
        {(activeTab === 'all' || activeTab === 'pillars') && <PillarsGrid />}
        {(activeTab === 'all' || activeTab === 'audio') && <AudioSynthesizerLab />}
        {(activeTab === 'all' || activeTab === 'sandbox') && <DungeonLightingSandbox />}
        {(activeTab === 'all' || activeTab === 'engine') && <EngineComparison />}
        {(activeTab === 'all' || activeTab === 'code') && <SourceCodeInspector />}
        {(activeTab === 'all' || activeTab === 'calculator') && <SizeCalculator />}
      </main>

      {/* Footer */}
      <footer className="border-t border-stone-900 bg-stone-950 py-10 text-stone-500 text-xs">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Flame className="h-4 w-4 text-amber-500" />
            <span className="font-mono text-stone-300">Torchbound Technical Deconstruction</span>
            <span>&middot;</span>
            <span>Version 2.2.0 Architecture Study</span>
          </div>

          <div className="flex items-center gap-4 font-mono">
            <a
              href="https://torchbound-duk.pages.dev/download/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition flex items-center gap-1"
            >
              <span>Official Download Site</span>
              <ExternalLink className="h-3 w-3" />
            </a>
            <a
              href="https://neutralino.js.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-amber-400 transition flex items-center gap-1"
            >
              <span>Neutralinojs</span>
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
