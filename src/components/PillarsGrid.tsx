import React, { useState } from 'react';
import { 
  Cpu, 
  Volume2, 
  Sparkles, 
  Compass, 
  Radio, 
  ChevronRight, 
  ShieldAlert, 
  Zap, 
  FileCheck2,
  SlidersHorizontal
} from 'lucide-react';

interface Pillar {
  id: string;
  icon: React.ReactNode;
  tag: string;
  title: string;
  headline: string;
  savedMegabytes: string;
  description: string;
  howItWorks: string[];
  conventionalComparison: string;
}

const PILLARS: Pillar[] = [
  {
    id: 'neutralino',
    icon: <Cpu className="h-5 w-5 text-purple-400" />,
    tag: 'PILLAR 1 · DESKTOP PACKAGING',
    title: 'Neutralinojs + Edge WebView2',
    headline: 'Eliminating the 150 MB "Electron Tax"',
    savedMegabytes: 'Saves 150–200 MB',
    description: 'Most desktop HTML5 games wrap themselves in Electron, which includes an entire copy of Google Chromium and Node.js. Torchbound instead uses Neutralinojs, which leaves the browser engine to Windows.',
    howItWorks: [
      'Windows 10 and 11 already ship with Microsoft Edge WebView2 pre-installed by default.',
      'Neutralinojs provides a lightweight 2.7 MB C++ binary launcher that asks the OS to host the webpage natively in WebView2.',
      'Saves stay next to the executable in a local folder using Neutralino local file APIs.',
      'Result: The launcher is just 1.15 MB compressed, yet delivers 100% full desktop performance, fullscreen F11, and hardware acceleration.'
    ],
    conventionalComparison: 'An Electron app with the same HTML game would immediately weigh 180+ MB before adding a single sprite.'
  },
  {
    id: 'audio',
    icon: <Volume2 className="h-5 w-5 text-cyan-400" />,
    tag: 'PILLAR 2 · SOUND DESIGN',
    title: 'Mathematical Procedural Audio',
    headline: 'Zero Audio Files: Every Sound is Synthesized in Real-Time',
    savedMegabytes: 'Saves 40–120 MB',
    description: 'Games typically ship hundreds of .wav, .ogg, or .mp3 audio clips for footsteps, sword swings, monster growls, spells, and background ambience. Torchbound ships exactly zero sound files.',
    howItWorks: [
      'All sound effects use the native Web Audio API (AudioContext, OscillatorNode, BiquadFilter, GainNode).',
      'A sword slash is a 120ms sawtooth pitch drop from 750Hz to 80Hz.',
      'A monster roar is frequency modulation (FM) synthesis with low-frequency oscillators.',
      'Ambient dungeon drones are dual detuned triangle waves with sweeping resonant lowpass filters.',
      'Music tracks are algorithmic sequences of arpeggiated note frequencies played through procedural synths.'
    ],
    conventionalComparison: 'A standard indie dungeon crawler has 50–200 MB of audio files in its Assets/Audio directory.'
  },
  {
    id: 'sprites',
    icon: <Sparkles className="h-5 w-5 text-amber-400" />,
    tag: 'PILLAR 3 · GRAPHICS & ART',
    title: 'RLE Pixel Art & Canvas Lighting',
    headline: 'Procedural Color Math & Dynamic 2D Light Masks',
    savedMegabytes: 'Saves 30–80 MB',
    description: 'Instead of shipping hundreds of megabytes of high-res sprite sheets, normal maps, or 3D models, Torchbound encodes compact base64 pixel bitmaps and renders dark dungeon lighting with 2D canvas blend modes.',
    howItWorks: [
      'Character, monster, and tile bitmaps are stored in run-length-encoded (RLE) strings decoded into offscreen canvases.',
      'Dynamic Palette Swapping: Instead of creating 50 separate sprite PNGs for different enemy tiers or armor colors, one template sprite is recolored at runtime using arithmetic color mixing (hexRGB & shade functions).',
      'Torchlight & Fog of War: A dark overlay is drawn over the canvas, and light circles are dynamically carved out using globalCompositeOperation = "destination-out" with radial falloff gradients.'
    ],
    conventionalComparison: 'Unity/Unreal 2D games bundle large PNG sprite atlases, normal maps, and shader asset bundles.'
  },
  {
    id: 'procedural-world',
    icon: <Compass className="h-5 w-5 text-emerald-400" />,
    tag: 'PILLAR 4 · WORLD GENERATION',
    title: 'Seeded Mulberry32 PRNG Dungeons',
    headline: 'Infinite Replayable Dungeons from a Single 32-bit Integer',
    savedMegabytes: 'Saves 20–60 MB',
    description: 'Torchbound contains zero pre-baked 3D meshes, tilemap files, or static level JSON exports. Dungeon levels, catacombs, loot chests, and mob placements are calculated on the fly using deterministic algorithms.',
    howItWorks: [
      'A compact Mulberry32 pseudo-random number generator (under 15 lines of JavaScript) produces predictable random sequences from a seed.',
      'Dungeons are carved out room-by-room and corridor-by-corridor in memory.',
      'Coordinate hash functions (hash2(x, y, seed)) calculate wall tile decorations, cracks, and torch placements on demand.',
      'Because the algorithm is 100% deterministic, multiplayer peers generate identical dungeons without downloading level files.'
    ],
    conventionalComparison: 'Games with handmade or pre-baked levels often bundle 20–100 MB of map data, collision meshes, and scene files.'
  },
  {
    id: 'networking',
    icon: <Radio className="h-5 w-5 text-rose-400" />,
    tag: 'PILLAR 5 · NETWORKING',
    title: 'Serverless WebRTC Co-op',
    headline: 'Peer-to-Peer Multiplayer with Zero Dedicated Server Binaries',
    savedMegabytes: 'Saves 15–40 MB',
    description: 'Torchbound features full co-op dungeon crawling without bundling a dedicated game server executable or connecting to a costly game server infrastructure.',
    howItWorks: [
      'Uses WebRTC Peer-to-Peer DataChannels mediated by an embedded lightweight PeerJS library.',
      'One player\'s client acts as the authoritative simulation host, while other players connect directly via peer-to-peer data channels.',
      'Synchronizes only compact input deltas (dx, dy, action buttons) rather than heavy state frames.',
      'Zero game server binaries, zero server maintenance costs, and zero network bloat in the client package.'
    ],
    conventionalComparison: 'Most co-op games require bundling multiplayer server runtimes, dedicated matchmakers, or multi-megabyte networking SDKs.'
  }
];

export const PillarsGrid: React.FC = () => {
  const [activePillarId, setActivePillarId] = useState<string>(PILLARS[0].id);

  const activePillar = PILLARS.find(p => p.id === activePillarId) || PILLARS[0];

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              The 5 Architectural Pillars of Extreme Miniaturization
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            How modern web standards and mathematical generation replace hundreds of megabytes of game assets
          </p>
        </div>
      </div>

      {/* Tabs / Pills */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        {PILLARS.map(p => {
          const isActive = p.id === activePillarId;
          return (
            <button
              key={p.id}
              onClick={() => setActivePillarId(p.id)}
              className={`p-3 rounded-xl border text-left transition flex flex-col justify-between gap-2 ${
                isActive 
                  ? 'bg-amber-950/60 border-amber-500/60 shadow-lg shadow-amber-950/50' 
                  : 'bg-stone-950/60 border-stone-800/80 hover:bg-stone-800/40 text-stone-400'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`p-1.5 rounded-lg bg-stone-900 border border-stone-800 ${isActive ? 'text-amber-400' : 'text-stone-400'}`}>
                  {p.icon}
                </span>
                <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-950/50 px-2 py-0.5 rounded border border-emerald-900/50">
                  {p.savedMegabytes}
                </span>
              </div>
              <div>
                <span className="block text-[10px] font-mono text-stone-400">{p.tag.split('·')[0]}</span>
                <h4 className={`text-xs font-bold leading-tight mt-0.5 ${isActive ? 'text-amber-200' : 'text-stone-300'}`}>
                  {p.title}
                </h4>
              </div>
            </button>
          );
        })}
      </div>

      {/* Deep-Dive Active Pillar Display */}
      <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-950/50 border border-amber-600/30 text-amber-400">
              {activePillar.icon}
            </div>
            <div>
              <span className="text-xs font-mono text-amber-400/90 font-medium tracking-wide">
                {activePillar.tag}
              </span>
              <h3 className="text-lg font-bold text-stone-100 font-serif">
                {activePillar.headline}
              </h3>
            </div>
          </div>

          <div className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-950/40 px-3 py-1 text-xs font-mono font-semibold text-emerald-300 self-start sm:self-auto">
            <Zap className="h-3.5 w-3.5 text-emerald-400" />
            <span>{activePillar.savedMegabytes}</span>
          </div>
        </div>

        <p className="text-sm text-stone-300 leading-relaxed">
          {activePillar.description}
        </p>

        <div className="space-y-2">
          <h5 className="text-xs font-mono font-semibold uppercase tracking-wider text-amber-300/80 flex items-center gap-1.5">
            <FileCheck2 className="h-3.5 w-3.5 text-amber-400" />
            <span>Technical Mechanics Under the Hood</span>
          </h5>
          <ul className="grid sm:grid-cols-2 gap-2 text-xs text-stone-300">
            {activePillar.howItWorks.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2 bg-stone-900/60 p-2.5 rounded-lg border border-stone-800/80">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-stone-800 text-[10px] font-mono text-amber-400">
                  {idx + 1}
                </span>
                <span className="leading-relaxed">{step}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-lg border border-rose-900/40 bg-rose-950/20 p-3 text-xs text-rose-200/90 flex items-start gap-2.5">
          <ShieldAlert className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
          <div>
            <strong className="font-semibold text-rose-300">Why typical games fail this: </strong>
            <span>{activePillar.conventionalComparison}</span>
          </div>
        </div>
      </div>
    </section>
  );
};
