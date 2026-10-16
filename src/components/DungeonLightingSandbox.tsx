import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Flame, 
  RefreshCw, 
  Gamepad2, 
  Maximize2, 
  ExternalLink, 
  Layers, 
  Sparkles,
  Zap,
  Play
} from 'lucide-react';
import { playProceduralSound } from '../services/proceduralAudio';

const TILE_SIZE = 24;
const GRID_W = 20;
const GRID_H = 14;

// Simple deterministic Mulberry32 PRNG
function mulberry32(seed: number) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export const DungeonLightingSandbox: React.FC = () => {
  const [activeView, setActiveView] = useState<'actual-game' | 'tech-sandbox'>('actual-game');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Technical Sandbox State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [seed, setSeed] = useState<number>(1337);
  const [renderMode, setRenderMode] = useState<'torch' | 'bright' | 'mask'>('torch');
  const [torchRadius, setTorchRadius] = useState<number>(100);
  const [coinsCollected, setCoinsCollected] = useState<number>(0);

  // Player state
  const playerRef = useRef<{ x: number; y: number }>({ x: 3 * TILE_SIZE, y: 3 * TILE_SIZE });
  const mapGridRef = useRef<number[][]>([]);
  const coinsRef = useRef<{ x: number; y: number; collected: boolean }[]>([]);
  const torchesRef = useRef<{ x: number; y: number }[]>([]);

  const reloadGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = 'https://torchbound-duk.pages.dev/';
    }
  };

  const toggleFullscreen = () => {
    if (containerRef.current) {
      if (!document.fullscreenElement) {
        containerRef.current.requestFullscreen().catch(() => {});
      } else {
        document.exitFullscreen().catch(() => {});
      }
    }
  };

  // Generate dungeon from seed
  const generateDungeon = useCallback((currentSeed: number) => {
    const rng = mulberry32(currentSeed);
    const grid: number[][] = [];
    
    // 0: floor, 1: wall
    for (let y = 0; y < GRID_H; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_W; x++) {
        if (x === 0 || y === 0 || x === GRID_W - 1 || y === GRID_H - 1) {
          grid[y][x] = 1;
        } else {
          const isPillar = (x % 4 === 0 && y % 4 === 0 && rng() > 0.4);
          const isRandomWall = rng() > 0.78;
          grid[y][x] = (isPillar || isRandomWall) ? 1 : 0;
        }
      }
    }

    for (let x = 2; x < GRID_W - 2; x++) grid[Math.floor(GRID_H / 2)][x] = 0;
    for (let y = 2; y < GRID_H - 2; y++) grid[y][Math.floor(GRID_W / 2)] = 0;

    const coins: { x: number; y: number; collected: boolean }[] = [];
    for (let i = 0; i < 6; i++) {
      const cx = Math.floor(rng() * (GRID_W - 2)) + 1;
      const cy = Math.floor(rng() * (GRID_H - 2)) + 1;
      if (grid[cy][cx] === 0) {
        coins.push({ x: cx * TILE_SIZE + TILE_SIZE / 2, y: cy * TILE_SIZE + TILE_SIZE / 2, collected: false });
      }
    }

    const torches: { x: number; y: number }[] = [
      { x: 5 * TILE_SIZE, y: 3 * TILE_SIZE },
      { x: 15 * TILE_SIZE, y: 10 * TILE_SIZE },
      { x: 14 * TILE_SIZE, y: 4 * TILE_SIZE }
    ];

    mapGridRef.current = grid;
    coinsRef.current = coins;
    torchesRef.current = torches;
    playerRef.current = { x: 3 * TILE_SIZE + TILE_SIZE / 2, y: 3 * TILE_SIZE + TILE_SIZE / 2 };
  }, []);

  useEffect(() => {
    generateDungeon(seed);
  }, [seed, generateDungeon]);

  const tryMove = useCallback((dx: number, dy: number) => {
    const p = playerRef.current;
    const grid = mapGridRef.current;
    if (!grid.length) return;

    const newX = p.x + dx;
    const newY = p.y + dy;
    const gx = Math.floor(newX / TILE_SIZE);
    const gy = Math.floor(newY / TILE_SIZE);

    if (gx >= 0 && gx < GRID_W && gy >= 0 && gy < GRID_H) {
      if (grid[gy][gx] === 0) {
        p.x = newX;
        p.y = newY;
        playProceduralSound('footstep');

        coinsRef.current.forEach(coin => {
          if (!coin.collected && Math.hypot(p.x - coin.x, p.y - coin.y) < 16) {
            coin.collected = true;
            setCoinsCollected(c => c + 1);
            playProceduralSound('coin');
          }
        });
      }
    }
  }, []);

  useEffect(() => {
    if (activeView !== 'tech-sandbox') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const step = 8;
      if (['ArrowUp', 'KeyW'].includes(e.code)) {
        e.preventDefault();
        tryMove(0, -step);
      } else if (['ArrowDown', 'KeyS'].includes(e.code)) {
        e.preventDefault();
        tryMove(0, step);
      } else if (['ArrowLeft', 'KeyA'].includes(e.code)) {
        e.preventDefault();
        tryMove(-step, 0);
      } else if (['ArrowRight', 'KeyD'].includes(e.code)) {
        e.preventDefault();
        tryMove(step, 0);
      } else if (e.code === 'Space') {
        e.preventDefault();
        playProceduralSound('slash');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tryMove, activeView]);

  // Render Loop for Tech Sandbox
  useEffect(() => {
    if (activeView !== 'tech-sandbox') return;
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick++;
      const grid = mapGridRef.current;
      const p = playerRef.current;
      const width = canvas.width;
      const height = canvas.height;

      // 1. Draw World Tiles
      ctx.fillStyle = '#0f0c15';
      ctx.fillRect(0, 0, width, height);

      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          const isWall = grid[y]?.[x] === 1;
          const px = x * TILE_SIZE;
          const py = y * TILE_SIZE;

          if (isWall) {
            ctx.fillStyle = '#221c2e';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#322b40';
            ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 3);
            ctx.fillStyle = '#161220';
            ctx.fillRect(px + 1, py + TILE_SIZE - 3, TILE_SIZE - 2, 2);
          } else {
            ctx.fillStyle = (x + y) % 2 === 0 ? '#13111c' : '#181523';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#231f30';
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      // 2. Draw Torches
      torchesRef.current.forEach(t => {
        ctx.fillStyle = '#6b4317';
        ctx.fillRect(t.x - 2, t.y - 2, 4, 10);
        const f = Math.sin(tick * 0.15 + t.x) * 2;
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(t.x, t.y - 4 + f, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      // 3. Draw Coins
      coinsRef.current.forEach(coin => {
        if (!coin.collected) {
          ctx.fillStyle = '#eab308';
          ctx.beginPath();
          ctx.arc(coin.x, coin.y, 4, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Draw Player
      ctx.fillStyle = '#38bdf8';
      ctx.fillRect(p.x - 5, p.y - 7, 10, 8);
      ctx.fillStyle = '#cbd5e1';
      ctx.fillRect(p.x - 6, p.y + 1, 12, 9);
      ctx.fillStyle = '#d97706';
      ctx.fillRect(p.x + 6, p.y - 2, 3, 10);

      // Flame
      const pFlicker = Math.sin(tick * 0.2) * 2;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(p.x + 7, p.y - 4 + pFlicker, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 5. Lighting
      if (renderMode === 'torch') {
        ctx.fillStyle = 'rgba(7, 5, 12, 0.94)';
        ctx.fillRect(0, 0, width, height);

        ctx.globalCompositeOperation = 'destination-out';

        const pRadius = torchRadius + Math.sin(tick * 0.1) * 4 + Math.cos(tick * 0.07) * 3;
        const pGrad = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, pRadius);
        pGrad.addColorStop(0, 'rgba(0,0,0,1)');
        pGrad.addColorStop(0.5, 'rgba(0,0,0,0.8)');
        pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalCompositeOperation = 'source-over';
      } else if (renderMode === 'mask') {
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, torchRadius, 0, Math.PI * 2);
        ctx.fill();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [renderMode, torchRadius, activeView]);

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Playable Torchbound Game (100% In-Browser &middot; 1.01 MB)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            The entire actual game loads and runs instantly directly from the web
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveView('actual-game')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeView === 'actual-game'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Play Actual Game</span>
          </button>

          <button
            onClick={() => setActiveView('tech-sandbox')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeView === 'tech-sandbox'
                ? 'bg-amber-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>Lighting &amp; PRNG Lab</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: THE ACTUAL TORCHBOUND GAME EMBEDDED */}
      {activeView === 'actual-game' && (
        <div className="space-y-4">
          <div 
            ref={containerRef}
            className="relative rounded-2xl border-2 border-amber-900/50 bg-black overflow-hidden shadow-2xl"
          >
            {/* Top Game Bar */}
            <div className="flex items-center justify-between bg-stone-950/95 px-4 py-2.5 border-b border-stone-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="font-bold text-amber-300">Torchbound v2.2.0 Live Game</span>
                <span className="text-stone-500">|</span>
                <span className="text-emerald-400 font-semibold hidden sm:inline">Payload: 1.01 MB (~298 KB Gzip)</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={reloadGame}
                  className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition cursor-pointer"
                  title="Reload Game"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={toggleFullscreen}
                  className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition cursor-pointer"
                  title="Fullscreen Mode"
                >
                  <Maximize2 className="h-3.5 w-3.5" />
                </button>
                <a
                  href="https://torchbound-duk.pages.dev/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-1.5 rounded-md hover:bg-stone-800 text-stone-400 hover:text-stone-200 transition"
                  title="Open in new window"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              </div>
            </div>

            {/* Embedded Live Game iFrame */}
            <iframe
              ref={iframeRef}
              src="https://torchbound-duk.pages.dev/"
              className="w-full h-[580px] bg-black block border-0"
              title="Torchbound Game"
              allow="autoplay; fullscreen; gamepad; focus-without-user-activation"
            />

            <div className="bg-stone-950/90 px-4 py-2 border-t border-stone-800 text-[11px] font-mono text-stone-400 flex flex-wrap items-center justify-between gap-2">
              <span>💡 Click inside the game to begin keyboard control (WASD, Arrows, Space, F11 for fullscreen).</span>
              <span className="text-amber-400">Zero installs &middot; Runs 100% locally in browser</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TECHNICAL LIGHTING & DUNGEON SANDBOX */}
      {activeView === 'tech-sandbox' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-3">
            <div className="relative rounded-xl border-2 border-stone-800 bg-black overflow-hidden shadow-2xl">
              <canvas
                ref={canvasRef}
                width={GRID_W * TILE_SIZE}
                height={GRID_H * TILE_SIZE}
                className="w-full h-auto block aspect-[20/14]"
              />

              <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                <span className="text-[11px] font-mono bg-stone-950/80 border border-stone-800 text-amber-300 px-2.5 py-1 rounded-md backdrop-blur">
                  Loot: {coinsCollected} Coins
                </span>
                <span className="text-[11px] font-mono bg-stone-950/80 border border-stone-800 text-stone-300 px-2.5 py-1 rounded-md backdrop-blur">
                  Mode: {renderMode === 'torch' ? 'Darkness Mask' : renderMode === 'bright' ? 'Full Vision' : 'Light Mask Only'}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between bg-stone-950/70 p-3 rounded-xl border border-stone-800">
              <div className="text-xs text-stone-400 font-mono hidden sm:block">
                Controls: <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 border border-stone-700">W</kbd>
                <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 border border-stone-700 ml-1">A</kbd>
                <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 border border-stone-700 ml-1">S</kbd>
                <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 border border-stone-700 ml-1">D</kbd> or Arrows
              </div>

              <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                <button
                  onClick={() => tryMove(-12, 0)}
                  className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                >
                  ←
                </button>
                <div className="flex flex-col gap-1.5">
                  <button
                    onClick={() => tryMove(0, -12)}
                    className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => tryMove(0, 12)}
                    className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                  >
                    ↓
                  </button>
                </div>
                <button
                  onClick={() => tryMove(12, 0)}
                  className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                >
                  →
                </button>
              </div>

              <button
                onClick={() => playProceduralSound('slash')}
                className="text-xs font-mono px-3 py-2 rounded-lg bg-amber-600/30 hover:bg-amber-600/50 text-amber-200 border border-amber-500/40 cursor-pointer flex items-center gap-1.5"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                <span>Swing Sword</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>Lighting Engine Controls</span>
              </h4>

              <div className="space-y-2">
                <label className="text-xs text-stone-400 block font-mono">Rendering Layer Mode:</label>
                <div className="grid grid-cols-1 gap-2">
                  <button
                    onClick={() => setRenderMode('torch')}
                    className={`p-2.5 rounded-lg border text-left text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                      renderMode === 'torch'
                        ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>1. Torchbound Dark Vision</span>
                    <span className="text-[10px] text-amber-400 font-normal">destination-out</span>
                  </button>

                  <button
                    onClick={() => setRenderMode('bright')}
                    className={`p-2.5 rounded-lg border text-left text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                      renderMode === 'bright'
                        ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>2. Full Brightness (Raw Tiles)</span>
                    <span className="text-[10px] text-stone-400 font-normal">No Darkness</span>
                  </button>

                  <button
                    onClick={() => setRenderMode('mask')}
                    className={`p-2.5 rounded-lg border text-left text-xs font-mono transition flex items-center justify-between cursor-pointer ${
                      renderMode === 'mask'
                        ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>3. Light Mask Geometry</span>
                    <span className="text-[10px] text-stone-400 font-normal">Radial Punch</span>
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
                <div className="flex justify-between text-xs font-mono text-stone-400">
                  <span>Torch Radius</span>
                  <span className="text-amber-400">{torchRadius}px</span>
                </div>
                <input
                  type="range"
                  min="50"
                  max="180"
                  value={torchRadius}
                  onChange={e => setTorchRadius(Number(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
              </div>

              <button
                onClick={() => {
                  const newSeed = Math.floor(Math.random() * 99999);
                  setSeed(newSeed);
                  playProceduralSound('torch');
                }}
                className="w-full py-2 rounded-lg border border-stone-700 bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono font-medium transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
                <span>Regenerate Seed: #{seed}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
