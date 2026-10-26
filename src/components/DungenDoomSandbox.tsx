import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Eye, 
  Crosshair, 
  Layers, 
  Sparkles, 
  Compass, 
  Volume2, 
  RefreshCw,
  Zap,
  Maximize2,
  ExternalLink,
  Gamepad2
} from 'lucide-react';
import { playProceduralSound } from '../services/proceduralAudio';
import { DUNGEN_DOOM_STATS } from '../data/dungenDoomData';

const MAP_W = 12;
const MAP_H = 12;
const DUNGEON_MAP = [
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 1, 0, 0, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 1, 2, 1, 1, 0, 0, 1, 0, 1],
  [1, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 1],
  [1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 1],
  [1, 0, 1, 1, 1, 0, 1, 1, 1, 1, 0, 1],
  [1, 0, 0, 0, 2, 0, 0, 0, 0, 1, 0, 1],
  [1, 0, 1, 0, 1, 0, 1, 0, 0, 0, 0, 1],
  [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

export const DungenDoomSandbox: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'actual-game' | 'tech-sandbox'>('actual-game');
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Technical Sandbox State
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'map'>('3d');
  const [pixelScale, setPixelScale] = useState<number>(3);
  const [depthFog, setDepthFog] = useState<boolean>(true);
  const [muzzleFlash, setMuzzleFlash] = useState<boolean>(false);
  const [monstersKilled, setMonstersKilled] = useState<number>(0);

  const playerRef = useRef({
    x: 1.5,
    y: 1.5,
    dir: 0.0,
  });

  const entitiesRef = useRef([
    { x: 3.5, y: 3.5, type: 'imp', alive: true },
    { x: 7.5, y: 7.5, type: 'imp', alive: true },
    { x: 2.0, y: 1.0, type: 'torch', alive: true },
    { x: 6.0, y: 5.0, type: 'torch', alive: true },
  ]);

  const reloadGame = () => {
    if (iframeRef.current) {
      iframeRef.current.src = 'https://kivylius.com/games/dungen-doom/';
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

  const tryMove = useCallback((forward: number, strafe: number) => {
    const p = playerRef.current;
    const cos = Math.cos(p.dir);
    const sin = Math.sin(p.dir);

    const dx = (cos * forward - sin * strafe) * 0.15;
    const dy = (sin * forward + cos * strafe) * 0.15;

    const newX = p.x + dx;
    const newY = p.y + dy;

    if (DUNGEON_MAP[Math.floor(p.y)][Math.floor(newX)] === 0) p.x = newX;
    if (DUNGEON_MAP[Math.floor(newY)][Math.floor(p.x)] === 0) p.y = newY;
    playProceduralSound('footstep');
  }, []);

  const rotate = useCallback((dAngle: number) => {
    playerRef.current.dir += dAngle;
  }, []);

  const shoot = useCallback(() => {
    setMuzzleFlash(true);
    playProceduralSound('slash');
    setTimeout(() => setMuzzleFlash(false), 80);

    const p = playerRef.current;
    entitiesRef.current.forEach(e => {
      if (e.type === 'imp' && e.alive) {
        const dx = e.x - p.x;
        const dy = e.y - p.y;
        const dist = Math.hypot(dx, dy);
        const angleTo = Math.atan2(dy, dx);
        let diff = angleTo - p.dir;
        while (diff < -Math.PI) diff += Math.PI * 2;
        while (diff > Math.PI) diff -= Math.PI * 2;

        if (dist < 5 && Math.abs(diff) < 0.35) {
          e.alive = false;
          setMonstersKilled(k => k + 1);
          playProceduralSound('monster');
        }
      }
    });
  }, []);

  useEffect(() => {
    if (activeTab !== 'tech-sandbox') return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (['KeyW', 'ArrowUp'].includes(e.code)) {
        e.preventDefault();
        tryMove(1, 0);
      } else if (['KeyS', 'ArrowDown'].includes(e.code)) {
        e.preventDefault();
        tryMove(-1, 0);
      } else if (['KeyA'].includes(e.code)) {
        e.preventDefault();
        tryMove(0, -1);
      } else if (['KeyD'].includes(e.code)) {
        e.preventDefault();
        tryMove(0, 1);
      } else if (['ArrowLeft', 'KeyQ'].includes(e.code)) {
        e.preventDefault();
        rotate(-0.12);
      } else if (['ArrowRight', 'KeyE'].includes(e.code)) {
        e.preventDefault();
        rotate(0.12);
      } else if (e.code === 'Space') {
        e.preventDefault();
        shoot();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [tryMove, rotate, shoot, activeTab]);

  // Render Loop for 3D Sandbox
  useEffect(() => {
    if (activeTab !== 'tech-sandbox') return;
    let animId: number;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let tick = 0;

    const render = () => {
      tick++;
      const p = playerRef.current;
      const W = canvas.width;
      const H = canvas.height;

      ctx.imageSmoothingEnabled = false;

      if (viewMode === '3d') {
        ctx.fillStyle = '#0a0812';
        ctx.fillRect(0, 0, W, H / 2);
        ctx.fillStyle = '#14111d';
        ctx.fillRect(0, H / 2, W, H / 2);

        const fov = 78 * (Math.PI / 180);
        const numRays = Math.floor(W / pixelScale);
        const halfFov = fov / 2;
        const zBuffer: number[] = new Array(numRays).fill(100);

        for (let i = 0; i < numRays; i++) {
          const rayAngle = p.dir - halfFov + (i / numRays) * fov;
          const cosRay = Math.cos(rayAngle);
          const sinRay = Math.sin(rayAngle);

          let dist = 0;
          let hit = 0;
          let hitSide = 0;
          const maxDist = 14;

          let rx = p.x;
          let ry = p.y;
          const stepSize = 0.02;

          while (dist < maxDist && hit === 0) {
            rx += cosRay * stepSize;
            ry += sinRay * stepSize;
            dist += stepSize;

            const mapX = Math.floor(rx);
            const mapY = Math.floor(ry);

            if (mapX >= 0 && mapX < MAP_W && mapY >= 0 && mapY < MAP_H) {
              if (DUNGEON_MAP[mapY][mapX] > 0) {
                hit = DUNGEON_MAP[mapY][mapX];
                hitSide = Math.abs(rx - Math.round(rx)) < Math.abs(ry - Math.round(ry)) ? 0 : 1;
              }
            }
          }

          const correctedDist = dist * Math.cos(rayAngle - p.dir);
          zBuffer[i] = correctedDist;

          const wallHeight = Math.min(H, (H / correctedDist) * 0.9);
          const wallTop = (H - wallHeight) / 2;

          let wallColor = hit === 2 ? '#7a4020' : '#3e3a48';
          if (hitSide === 1) wallColor = hit === 2 ? '#5d3016' : '#2d2a35';

          const fogFactor = depthFog ? Math.max(0, Math.min(1, (correctedDist - 2) / 10)) : 0;

          ctx.fillStyle = wallColor;
          const colX = i * pixelScale;
          ctx.fillRect(colX, wallTop, pixelScale, wallHeight);

          if (fogFactor > 0) {
            ctx.fillStyle = `rgba(10, 8, 18, ${fogFactor})`;
            ctx.fillRect(colX, wallTop, pixelScale, wallHeight);
          }
        }

        // Billboards
        entitiesRef.current
          .slice()
          .map(ent => {
            const dx = ent.x - p.x;
            const dy = ent.y - p.y;
            const dist = Math.hypot(dx, dy);
            const angleTo = Math.atan2(dy, dx);
            let diff = angleTo - p.dir;
            while (diff < -Math.PI) diff += Math.PI * 2;
            while (diff > Math.PI) diff -= Math.PI * 2;
            return { ...ent, dist, diff };
          })
          .sort((a, b) => b.dist - a.dist)
          .forEach(ent => {
            if (ent.dist < 0.2 || ent.dist > 12) return;
            if (Math.abs(ent.diff) > halfFov + 0.3) return;

            const screenX = (W / 2) + Math.tan(ent.diff) * (W / (2 * Math.tan(halfFov)));
            const spriteSize = Math.min(H * 1.5, (H / ent.dist) * 0.75);
            const spriteTop = (H - spriteSize) / 2 + (H / ent.dist) * 0.1;

            const rayIdx = Math.floor(screenX / pixelScale);
            if (rayIdx >= 0 && rayIdx < numRays && ent.dist > zBuffer[rayIdx]) {
              return;
            }

            if (ent.type === 'imp') {
              if (ent.alive) {
                ctx.fillStyle = '#b91c1c';
                ctx.fillRect(screenX - spriteSize * 0.25, spriteTop, spriteSize * 0.5, spriteSize * 0.4);
                ctx.fillStyle = '#fde047';
                ctx.fillRect(screenX - spriteSize * 0.15, spriteTop + spriteSize * 0.12, spriteSize * 0.08, spriteSize * 0.08);
                ctx.fillRect(screenX + spriteSize * 0.07, spriteTop + spriteSize * 0.12, spriteSize * 0.08, spriteSize * 0.08);
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(screenX - spriteSize * 0.3, spriteTop + spriteSize * 0.38, spriteSize * 0.6, spriteSize * 0.5);
              } else {
                ctx.fillStyle = '#450a0a';
                ctx.fillRect(screenX - spriteSize * 0.3, spriteTop + spriteSize * 0.7, spriteSize * 0.6, spriteSize * 0.2);
              }
            } else if (ent.type === 'torch') {
              const f = Math.sin(tick * 0.2) * 2;
              ctx.fillStyle = '#6b4317';
              ctx.fillRect(screenX - 2, spriteTop + spriteSize * 0.4, 4, spriteSize * 0.4);
              ctx.fillStyle = '#f59e0b';
              ctx.beginPath();
              ctx.arc(screenX, spriteTop + spriteSize * 0.35 + f, spriteSize * 0.12, 0, Math.PI * 2);
              ctx.fill();
            }
          });

        if (muzzleFlash) {
          ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
          ctx.fillRect(0, 0, W, H);
        }

        // Shotgun
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(W / 2 - 14, H - 65, 12, 65);
        ctx.fillRect(W / 2 + 2, H - 65, 12, 65);

        // Crosshair
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(W / 2 - 8, H / 2);
        ctx.lineTo(W / 2 + 8, H / 2);
        ctx.moveTo(W / 2, H / 2 - 8);
        ctx.lineTo(W / 2, H / 2 + 8);
        ctx.stroke();

      } else {
        ctx.fillStyle = '#0f0d18';
        ctx.fillRect(0, 0, W, H);

        const cellSize = Math.min(W, H) / MAP_W;
        for (let y = 0; y < MAP_H; y++) {
          for (let x = 0; x < MAP_W; x++) {
            const val = DUNGEON_MAP[y][x];
            ctx.fillStyle = val === 1 ? '#3e3a48' : val === 2 ? '#7a4020' : '#14111d';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
          }
        }

        const px = p.x * cellSize;
        const py = p.y * cellSize;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        const fov = 78 * (Math.PI / 180);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(p.dir - fov / 2) * 50, py + Math.sin(p.dir - fov / 2) * 50);
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(p.dir + fov / 2) * 50, py + Math.sin(p.dir + fov / 2) * 50);
        ctx.stroke();
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [viewMode, pixelScale, depthFog, muzzleFlash, activeTab]);

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-rose-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Playable Dungen Doom Game (3D Retro FPS &middot; {DUNGEN_DOOM_STATS.bundleGzipKB} KB)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Play the real 3D game live in the browser, or inspect the 3D raycast &amp; billboarding engine
          </p>
        </div>

        {/* Mode Switcher */}
        <div className="flex items-center gap-2 bg-stone-950 p-1.5 rounded-xl border border-stone-800">
          <button
            onClick={() => setActiveTab('actual-game')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'actual-game'
                ? 'bg-rose-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Gamepad2 className="h-3.5 w-3.5" />
            <span>Play Actual Game</span>
          </button>

          <button
            onClick={() => setActiveTab('tech-sandbox')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition cursor-pointer ${
              activeTab === 'tech-sandbox'
                ? 'bg-rose-500 text-stone-950 shadow'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Layers className="h-3.5 w-3.5" />
            <span>3D Engine Lab</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: THE ACTUAL DUNGEN DOOM GAME EMBEDDED */}
      {activeTab === 'actual-game' && (
        <div className="space-y-4">
          <div 
            ref={containerRef}
            className="relative rounded-2xl border-2 border-rose-900/50 bg-black overflow-hidden shadow-2xl"
          >
            {/* Top Game Bar */}
            <div className="flex items-center justify-between bg-stone-950/95 px-4 py-2.5 border-b border-stone-800 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="flex h-2.5 w-2.5 rounded-full bg-rose-500 animate-pulse" />
                <span className="font-bold text-rose-300">Dungen Doom Live 3D Engine</span>
                <span className="text-stone-500">|</span>
                <span className="text-emerald-400 font-semibold hidden sm:inline">Transfer: {DUNGEN_DOOM_STATS.bundleGzipKB} KB Gzip (Three.js WebGL)</span>
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
                  href="https://kivylius.com/games/dungen-doom/"
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
              src="https://kivylius.com/games/dungen-doom/"
              className="w-full h-[580px] bg-black block border-0"
              title="Dungen Doom Game"
              allow="autoplay; fullscreen; gamepad; focus-without-user-activation"
            />

            <div className="bg-stone-950/90 px-4 py-2 border-t border-stone-800 text-[11px] font-mono text-stone-400 flex flex-wrap items-center justify-between gap-2">
              <span>💡 Click the game screen to lock mouse and move (WASD to walk, Mouse to aim/shoot, E to open doors).</span>
              <span className="text-rose-400">Zero external 3D models &middot; {DUNGEN_DOOM_STATS.bundleGzipKB} KB JS network load</span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: TECHNICAL 3D ENGINE LAB */}
      {activeTab === 'tech-sandbox' && (
        <div className="grid lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 space-y-3">
            <div className="relative rounded-xl border-2 border-stone-800 bg-black overflow-hidden shadow-2xl">
              <canvas
                ref={canvasRef}
                width={480}
                height={320}
                className="w-full h-auto block aspect-[3/2] cursor-crosshair"
                onClick={shoot}
              />

              <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
                <span className="text-[11px] font-mono bg-stone-950/85 border border-stone-800 text-rose-300 px-2.5 py-1 rounded-md backdrop-blur">
                  Demons Slain: {monstersKilled}
                </span>
                <span className="text-[11px] font-mono bg-stone-950/85 border border-stone-800 text-stone-300 px-2.5 py-1 rounded-md backdrop-blur">
                  View: {viewMode === '3d' ? '3D Perspective' : 'Raycast Map'}
                </span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950/70 p-3 rounded-xl border border-stone-800">
              <div className="text-xs text-stone-400 font-mono hidden sm:block">
                Move: <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700">W</kbd>
                <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700 ml-1">S</kbd> &middot; Turn:
                <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700 ml-1">Q</kbd>
                <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700 ml-1">E</kbd> &middot; Shoot:
                <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700 ml-1">Space</kbd> / Click
              </div>

              <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
                <button
                  onClick={() => rotate(-0.15)}
                  className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                >
                  ↺
                </button>
                <button
                  onClick={() => tryMove(1, 0)}
                  className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                >
                  ↑
                </button>
                <button
                  onClick={() => tryMove(-1, 0)}
                  className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                >
                  ↓
                </button>
                <button
                  onClick={() => rotate(0.15)}
                  className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                >
                  ↻
                </button>
              </div>

              <button
                onClick={shoot}
                className="text-xs font-mono px-3.5 py-2 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 cursor-pointer flex items-center gap-1.5"
              >
                <Crosshair className="h-4 w-4 text-rose-400" />
                <span>Shoot</span>
              </button>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-4">
            <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-4">
              <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span>3D Engine Controls</span>
              </h4>

              <div className="space-y-1.5">
                <label className="text-xs text-stone-400 block font-mono">Camera View:</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setViewMode('3d')}
                    className={`p-2 rounded-lg border text-xs font-mono transition text-center cursor-pointer ${
                      viewMode === '3d'
                        ? 'bg-rose-950/50 border-rose-500 text-rose-200 font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    3D Perspective
                  </button>
                  <button
                    onClick={() => setViewMode('map')}
                    className={`p-2 rounded-lg border text-xs font-mono transition text-center cursor-pointer ${
                      viewMode === 'map'
                        ? 'bg-rose-950/50 border-rose-500 text-rose-200 font-bold'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Raycast Map
                  </button>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-mono text-stone-400">
                  <span>PixelScale Downsampler:</span>
                  <span className="text-amber-400 font-bold">{pixelScale}x</span>
                </div>
                <div className="grid grid-cols-3 gap-1.5">
                  {[1, 2, 3].map(scale => (
                    <button
                      key={scale}
                      onClick={() => setPixelScale(scale)}
                      className={`py-1.5 rounded-lg border text-xs font-mono transition cursor-pointer ${
                        pixelScale === scale
                          ? 'bg-amber-950/50 border-amber-500 text-amber-200 font-bold'
                          : 'bg-stone-900 border-stone-800 text-stone-400'
                      }`}
                    >
                      {scale}x
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-800/80 flex items-center justify-between">
                <div>
                  <span className="text-xs font-mono text-stone-300 block">Linear Depth Fog</span>
                  <span className="text-[11px] text-stone-500 font-mono">fogNear: 3, fogFar: 34</span>
                </div>
                <button
                  onClick={() => setDepthFog(!depthFog)}
                  className={`px-3 py-1 rounded-lg border text-xs font-mono font-medium transition cursor-pointer ${
                    depthFog
                      ? 'bg-emerald-950 border-emerald-600 text-emerald-300'
                      : 'bg-stone-900 border-stone-800 text-stone-400'
                  }`}
                >
                  {depthFog ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
