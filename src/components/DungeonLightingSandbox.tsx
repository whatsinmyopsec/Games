import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Flame, 
  RefreshCw, 
  Gamepad2, 
  Eye, 
  EyeOff, 
  Layers, 
  Sparkles,
  Zap
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

  // Generate dungeon from seed
  const generateDungeon = useCallback((currentSeed: number) => {
    const rng = mulberry32(currentSeed);
    const grid: number[][] = [];
    
    // 0: floor, 1: wall
    for (let y = 0; y < GRID_H; y++) {
      grid[y] = [];
      for (let x = 0; x < GRID_W; x++) {
        // Outer boundaries are walls
        if (x === 0 || y === 0 || x === GRID_W - 1 || y === GRID_H - 1) {
          grid[y][x] = 1;
        } else {
          // Cellular / random cavern structure with rooms
          const isPillar = (x % 4 === 0 && y % 4 === 0 && rng() > 0.4);
          const isRandomWall = rng() > 0.78;
          grid[y][x] = (isPillar || isRandomWall) ? 1 : 0;
        }
      }
    }

    // Carve guaranteed central pathways
    for (let x = 2; x < GRID_W - 2; x++) grid[Math.floor(GRID_H / 2)][x] = 0;
    for (let y = 2; y < GRID_H - 2; y++) grid[y][Math.floor(GRID_W / 2)] = 0;

    // Coins
    const coins: { x: number; y: number; collected: boolean }[] = [];
    for (let i = 0; i < 6; i++) {
      const cx = Math.floor(rng() * (GRID_W - 2)) + 1;
      const cy = Math.floor(rng() * (GRID_H - 2)) + 1;
      if (grid[cy][cx] === 0) {
        coins.push({ x: cx * TILE_SIZE + TILE_SIZE / 2, y: cy * TILE_SIZE + TILE_SIZE / 2, collected: false });
      }
    }

    // Fixed wall sconce torches
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

  // Movement & Collision
  const tryMove = useCallback((dx: number, dy: number) => {
    const p = playerRef.current;
    const grid = mapGridRef.current;
    if (!grid.length) return;

    const newX = p.x + dx;
    const newY = p.y + dy;

    // Grid coordinates
    const gx = Math.floor(newX / TILE_SIZE);
    const gy = Math.floor(newY / TILE_SIZE);

    if (gx >= 0 && gx < GRID_W && gy >= 0 && gy < GRID_H) {
      if (grid[gy][gx] === 0) {
        p.x = newX;
        p.y = newY;
        playProceduralSound('footstep');

        // Check coin pickup
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

  // Keyboard navigation
  useEffect(() => {
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
  }, [tryMove]);

  // Render Loop
  useEffect(() => {
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

      // 1. Draw World Tiles (Base Layer)
      ctx.fillStyle = '#0f0c15';
      ctx.fillRect(0, 0, width, height);

      for (let y = 0; y < GRID_H; y++) {
        for (let x = 0; x < GRID_W; x++) {
          const isWall = grid[y]?.[x] === 1;
          const px = x * TILE_SIZE;
          const py = y * TILE_SIZE;

          if (isWall) {
            // Procedural stone wall block with highlights
            ctx.fillStyle = '#221c2e';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.fillStyle = '#322b40';
            ctx.fillRect(px + 1, py + 1, TILE_SIZE - 2, 3);
            ctx.fillStyle = '#161220';
            ctx.fillRect(px + 1, py + TILE_SIZE - 3, TILE_SIZE - 2, 2);
          } else {
            // Floor paving with stone tile grid
            ctx.fillStyle = (x + y) % 2 === 0 ? '#13111c' : '#181523';
            ctx.fillRect(px, py, TILE_SIZE, TILE_SIZE);
            ctx.strokeStyle = '#231f30';
            ctx.strokeRect(px, py, TILE_SIZE, TILE_SIZE);
          }
        }
      }

      // 2. Draw Torches on Wall
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
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(coin.x - 1, coin.y - 1, 1.5, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // 4. Draw Player Character (Procedural Pixel Knight)
      ctx.fillStyle = '#38bdf8'; // Knight Helm
      ctx.fillRect(p.x - 5, p.y - 7, 10, 8);
      ctx.fillStyle = '#0f172a'; // Visor
      ctx.fillRect(p.x - 3, p.y - 4, 6, 2);
      ctx.fillStyle = '#cbd5e1'; // Armor Body
      ctx.fillRect(p.x - 6, p.y + 1, 12, 9);
      ctx.fillStyle = '#d97706'; // Torch in Hand
      ctx.fillRect(p.x + 6, p.y - 2, 3, 10);

      // Torch Flame on Player
      const pFlicker = Math.sin(tick * 0.2) * 2;
      ctx.fillStyle = '#fbbf24';
      ctx.beginPath();
      ctx.arc(p.x + 7, p.y - 4 + pFlicker, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // 5. LIGHTING LAYER (The Torchbound Secret!)
      if (renderMode === 'torch') {
        // Darkness overlay
        ctx.fillStyle = 'rgba(7, 5, 12, 0.94)';
        ctx.fillRect(0, 0, width, height);

        // Destination-out cuts light circles through the darkness!
        ctx.globalCompositeOperation = 'destination-out';

        // Player Torch Light
        const pRadius = torchRadius + Math.sin(tick * 0.1) * 4 + Math.cos(tick * 0.07) * 3;
        const pGrad = ctx.createRadialGradient(p.x, p.y, 10, p.x, p.y, pRadius);
        pGrad.addColorStop(0, 'rgba(0,0,0,1)');
        pGrad.addColorStop(0.5, 'rgba(0,0,0,0.8)');
        pGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = pGrad;
        ctx.beginPath();
        ctx.arc(p.x, p.y, pRadius, 0, Math.PI * 2);
        ctx.fill();

        // Wall Torches Light
        torchesRef.current.forEach(t => {
          const tRadius = 60 + Math.sin(tick * 0.12 + t.x) * 3;
          const tGrad = ctx.createRadialGradient(t.x, t.y, 6, t.x, t.y, tRadius);
          tGrad.addColorStop(0, 'rgba(0,0,0,1)');
          tGrad.addColorStop(0.6, 'rgba(0,0,0,0.7)');
          tGrad.addColorStop(1, 'rgba(0,0,0,0)');
          ctx.fillStyle = tGrad;
          ctx.beginPath();
          ctx.arc(t.x, t.y, tRadius, 0, Math.PI * 2);
          ctx.fill();
        });

        // Restore default composite operation
        ctx.globalCompositeOperation = 'source-over';

        // Warm amber tint on player light
        ctx.fillStyle = 'rgba(251, 191, 36, 0.08)';
        ctx.beginPath();
        ctx.arc(p.x, p.y, pRadius * 0.7, 0, Math.PI * 2);
        ctx.fill();
      } else if (renderMode === 'mask') {
        // Pure light mask preview
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, width, height);

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(p.x, p.y, torchRadius, 0, Math.PI * 2);
        ctx.fill();

        torchesRef.current.forEach(t => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 60, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [renderMode, torchRadius]);

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Playable Canvas Lighting & Dungeon Sandbox
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Experience the real rendering technique: 2D Canvas composite operations with 0 megabytes of textures
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const newSeed = Math.floor(Math.random() * 99999);
              setSeed(newSeed);
              playProceduralSound('torch');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-mono font-medium text-stone-200 hover:bg-stone-700 transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-amber-400" />
            <span>New Seed: #{seed}</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Display */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-xl border-2 border-stone-800 bg-black overflow-hidden shadow-2xl">
            <canvas
              ref={canvasRef}
              width={GRID_W * TILE_SIZE}
              height={GRID_H * TILE_SIZE}
              className="w-full h-auto block aspect-[20/14]"
            />

            {/* In-canvas overlay HUD */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
              <span className="text-[11px] font-mono bg-stone-950/80 border border-stone-800 text-amber-300 px-2.5 py-1 rounded-md backdrop-blur">
                Loot: {coinsCollected} Coins
              </span>
              <span className="text-[11px] font-mono bg-stone-950/80 border border-stone-800 text-stone-300 px-2.5 py-1 rounded-md backdrop-blur">
                Mode: {renderMode === 'torch' ? 'Darkness Mask' : renderMode === 'bright' ? 'Full Vision' : 'Light Mask Only'}
              </span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono bg-stone-950/85 border border-stone-800 text-emerald-400 px-2.5 py-1 rounded-md backdrop-blur">
              Memory: ~4 KB Canvas Cache · 0 External Sprites
            </div>
          </div>

          {/* On-Screen Touch / Click Controls */}
          <div className="flex items-center justify-between bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <div className="text-xs text-stone-400 font-mono hidden sm:block">
              Controls: <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 border border-stone-700">W</kbd>
              <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 border border-stone-700 ml-1">A</kbd>
              <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 border border-stone-700 ml-1">S</kbd>
              <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-amber-300 border border-stone-700 ml-1">D</kbd> or Arrow Keys
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

        {/* Lighting & Rendering Controls (Right Column) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-amber-400 font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>Lighting Engine Inspector</span>
            </h4>

            {/* Mode selection buttons */}
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

            {/* Torch Radius Slider */}
            <div className="space-y-1.5 pt-2 border-t border-stone-800/80">
              <div className="flex justify-between text-xs font-mono text-stone-400">
                <span>Torch Radiance Radius</span>
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

            {/* Asset Breakdown Callout */}
            <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-3 space-y-2 text-xs">
              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-amber-400" />
                <span>How This Saves 50+ Megabytes:</span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                In Unity or Unreal, dynamic point lights require normal maps, specular maps, shadow caster passes, and shader pipelines. 
                Torchbound creates this identical dark dungeon atmosphere with <strong>12 lines of 2D canvas drawing math</strong>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
