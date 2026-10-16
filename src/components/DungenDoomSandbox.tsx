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
  Info
} from 'lucide-react';
import { playProceduralSound } from '../services/proceduralAudio';

const MAP_W = 12;
const MAP_H = 12;
// 1 = stone wall, 2 = wooden door/crate, 0 = empty corridor
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [viewMode, setViewMode] = useState<'3d' | 'map'>('3d');
  const [pixelScale, setPixelScale] = useState<number>(3);
  const [depthFog, setDepthFog] = useState<boolean>(true);
  const [muzzleFlash, setMuzzleFlash] = useState<boolean>(false);
  const [monstersKilled, setMonstersKilled] = useState<number>(0);

  // Player state: (x, y) in map tiles, dir angle in radians
  const playerRef = useRef({
    x: 1.5,
    y: 1.5,
    dir: 0.0,
  });

  // Sprite entities in the dungeon: { x, y, type: 'imp' | 'torch', alive: boolean }
  const entitiesRef = useRef([
    { x: 3.5, y: 3.5, type: 'imp', alive: true },
    { x: 7.5, y: 7.5, type: 'imp', alive: true },
    { x: 2.0, y: 1.0, type: 'torch', alive: true },
    { x: 6.0, y: 5.0, type: 'torch', alive: true },
  ]);

  const tryMove = useCallback((forward: number, strafe: number) => {
    const p = playerRef.current;
    const cos = Math.cos(p.dir);
    const sin = Math.sin(p.dir);

    const dx = (cos * forward - sin * strafe) * 0.15;
    const dy = (sin * forward + cos * strafe) * 0.15;

    const newX = p.x + dx;
    const newY = p.y + dy;

    // Wall collision test
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

    // Simple raycast forward to hit monster
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

  // Keyboard navigation
  useEffect(() => {
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
  }, [tryMove, rotate, shoot]);

  // Main Render Loop (Retro Raycaster & 2.5D Billboarding)
  useEffect(() => {
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
        // --- 1. RENDER RETRO 3D VIEW (Wolfenstein/Doom Style) ---
        // Sky & Floor
        ctx.fillStyle = '#0a0812'; // Ceiling dark
        ctx.fillRect(0, 0, W, H / 2);
        ctx.fillStyle = '#14111d'; // Stone floor
        ctx.fillRect(0, H / 2, W, H / 2);

        // Raycasting FOV
        const fov = 78 * (Math.PI / 180);
        const numRays = Math.floor(W / pixelScale);
        const halfFov = fov / 2;
        const zBuffer: number[] = new Array(numRays).fill(100);

        // Torch flicker light modulation
        const flicker = Math.sin(tick * 0.1) * 0.08 + Math.cos(tick * 0.06) * 0.05;

        for (let i = 0; i < numRays; i++) {
          const rayAngle = p.dir - halfFov + (i / numRays) * fov;
          const cosRay = Math.cos(rayAngle);
          const sinRay = Math.sin(rayAngle);

          // DDA ray step
          let dist = 0;
          let hit = 0;
          let hitSide = 0; // 0 for vertical, 1 for horizontal
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

          // Correct fish-eye distortion
          const correctedDist = dist * Math.cos(rayAngle - p.dir);
          zBuffer[i] = correctedDist;

          // Wall height on screen
          const wallHeight = Math.min(H, (H / correctedDist) * 0.9);
          const wallTop = (H - wallHeight) / 2;

          // Procedural CanvasTexture Color & Depth Fog
          let wallColor = hit === 2 ? '#7a4020' : '#3e3a48'; // Wood vs Stone
          if (hitSide === 1) wallColor = hit === 2 ? '#5d3016' : '#2d2a35'; // Shadowed side

          // Apply Depth Fog (Linear attenuation)
          const fogFactor = depthFog ? Math.max(0, Math.min(1, (correctedDist - 2) / 10 - flicker)) : 0;

          ctx.fillStyle = wallColor;
          const colX = i * pixelScale;
          ctx.fillRect(colX, wallTop, pixelScale, wallHeight);

          // Fog overlay on wall column
          if (fogFactor > 0) {
            ctx.fillStyle = `rgba(10, 8, 18, ${fogFactor})`;
            ctx.fillRect(colX, wallTop, pixelScale, wallHeight);
          }

          // Stone brick mortar line detail (procedural brick texture effect)
          ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
          if (Math.floor(wallTop + wallHeight * 0.5) % 8 === 0) {
            ctx.fillRect(colX, wallTop + wallHeight * 0.5, pixelScale, 1.5);
          }
        }

        // --- 2. RENDER 2.5D BILLBOARD SPRITES (Facing Camera) ---
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
          .sort((a, b) => b.dist - a.dist) // Painter algorithm (render back-to-front)
          .forEach(ent => {
            if (ent.dist < 0.2 || ent.dist > 12) return;
            if (Math.abs(ent.diff) > halfFov + 0.3) return;

            // Screen X position
            const screenX = (W / 2) + Math.tan(ent.diff) * (W / (2 * Math.tan(halfFov)));
            const spriteSize = Math.min(H * 1.5, (H / ent.dist) * 0.75);
            const spriteTop = (H - spriteSize) / 2 + (H / ent.dist) * 0.1;

            // Check Z-buffer to see if behind wall
            const rayIdx = Math.floor(screenX / pixelScale);
            if (rayIdx >= 0 && rayIdx < numRays && ent.dist > zBuffer[rayIdx]) {
              return; // Occluded by wall!
            }

            if (ent.type === 'imp') {
              // Imp Demon Sprite
              if (ent.alive) {
                // Horns & Head
                ctx.fillStyle = '#b91c1c'; // Demon red
                ctx.fillRect(screenX - spriteSize * 0.25, spriteTop, spriteSize * 0.5, spriteSize * 0.4);
                // Glowing Yellow Eyes
                ctx.fillStyle = '#fde047';
                ctx.fillRect(screenX - spriteSize * 0.15, spriteTop + spriteSize * 0.12, spriteSize * 0.08, spriteSize * 0.08);
                ctx.fillRect(screenX + spriteSize * 0.07, spriteTop + spriteSize * 0.12, spriteSize * 0.08, spriteSize * 0.08);
                // Claws & Body
                ctx.fillStyle = '#7f1d1d';
                ctx.fillRect(screenX - spriteSize * 0.3, spriteTop + spriteSize * 0.38, spriteSize * 0.6, spriteSize * 0.5);
              } else {
                // Corpse on floor
                ctx.fillStyle = '#450a0a';
                ctx.fillRect(screenX - spriteSize * 0.3, spriteTop + spriteSize * 0.7, spriteSize * 0.6, spriteSize * 0.2);
              }
            } else if (ent.type === 'torch') {
              // Wall Sconce Torch Flame
              const f = Math.sin(tick * 0.2) * 2;
              ctx.fillStyle = '#6b4317';
              ctx.fillRect(screenX - 2, spriteTop + spriteSize * 0.4, 4, spriteSize * 0.4);
              ctx.fillStyle = '#f59e0b';
              ctx.beginPath();
              ctx.arc(screenX, spriteTop + spriteSize * 0.35 + f, spriteSize * 0.12, 0, Math.PI * 2);
              ctx.fill();
            }
          });

        // --- 3. RETRO HUD & SHOTGUN WEAPON ---
        if (muzzleFlash) {
          ctx.fillStyle = 'rgba(253, 224, 71, 0.45)';
          ctx.fillRect(0, 0, W, H);
          // Muzzle star
          ctx.fillStyle = '#fef08a';
          ctx.beginPath();
          ctx.arc(W / 2, H * 0.7, 36, 0, Math.PI * 2);
          ctx.fill();
        }

        // Shotgun Barrel in center
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(W / 2 - 14, H - 65, 12, 65);
        ctx.fillRect(W / 2 + 2, H - 65, 12, 65);
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.arc(W / 2 - 8, H - 65, 6, 0, Math.PI * 2);
        ctx.arc(W / 2 + 8, H - 65, 6, 0, Math.PI * 2);
        ctx.fill();

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
        // --- 2. RENDER TOP-DOWN RAYCAST/MAP VIEW ---
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

        // Draw Player & FOV Cone
        const px = p.x * cellSize;
        const py = p.y * cellSize;

        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fill();

        // FOV Cone
        const fov = 78 * (Math.PI / 180);
        ctx.strokeStyle = 'rgba(251, 191, 36, 0.6)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(p.dir - fov / 2) * 50, py + Math.sin(p.dir - fov / 2) * 50);
        ctx.moveTo(px, py);
        ctx.lineTo(px + Math.cos(p.dir + fov / 2) * 50, py + Math.sin(p.dir + fov / 2) * 50);
        ctx.stroke();

        // Draw Entities
        entitiesRef.current.forEach(e => {
          ctx.fillStyle = e.type === 'imp' ? (e.alive ? '#ef4444' : '#7f1d1d') : '#f59e0b';
          ctx.beginPath();
          ctx.arc(e.x * cellSize, e.y * cellSize, 5, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [viewMode, pixelScale, depthFog, muzzleFlash]);

  return (
    <section className="rounded-2xl border border-stone-800 bg-stone-900/50 p-6 backdrop-blur space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-800 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <Eye className="h-5 w-5 text-rose-400" />
            <h2 className="text-xl font-bold text-stone-100 font-serif">
              Playable 3D Retro Engine Sandbox (Dungen Doom Tech)
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-stone-400 mt-1">
            Experience how Three.js &amp; 2.5D billboarding create a complete first-person Doom game in under 360 KB
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              entitiesRef.current.forEach(e => { if (e.type === 'imp') e.alive = true; });
              setMonstersKilled(0);
              playProceduralSound('torch');
            }}
            className="inline-flex items-center gap-1.5 rounded-lg border border-stone-700 bg-stone-800 px-3 py-1.5 text-xs font-mono font-medium text-stone-200 hover:bg-stone-700 transition cursor-pointer"
          >
            <RefreshCw className="h-3.5 w-3.5 text-rose-400" />
            <span>Respawn Demons</span>
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-12 gap-6 items-start">
        {/* Canvas Display Viewport */}
        <div className="lg:col-span-8 space-y-3">
          <div className="relative rounded-xl border-2 border-stone-800 bg-black overflow-hidden shadow-2xl">
            <canvas
              ref={canvasRef}
              width={480}
              height={320}
              className="w-full h-auto block aspect-[3/2] cursor-crosshair"
              onClick={shoot}
            />

            {/* In-canvas overlay HUD */}
            <div className="absolute top-2.5 left-2.5 flex items-center gap-2">
              <span className="text-[11px] font-mono bg-stone-950/85 border border-stone-800 text-rose-300 px-2.5 py-1 rounded-md backdrop-blur">
                Demons Slain: {monstersKilled}
              </span>
              <span className="text-[11px] font-mono bg-stone-950/85 border border-stone-800 text-stone-300 px-2.5 py-1 rounded-md backdrop-blur">
                View: {viewMode === '3d' ? '3D Retro Perspective' : 'Top-Down Raycast Grid'}
              </span>
            </div>

            <div className="absolute bottom-2.5 right-2.5 text-[10px] font-mono bg-stone-950/85 border border-stone-800 text-emerald-400 px-2.5 py-1 rounded-md backdrop-blur">
              Network Transfer: ~357 KB · 0 External 3D Models
            </div>
          </div>

          {/* Action / Movement Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3 bg-stone-950/70 p-3 rounded-xl border border-stone-800">
            <div className="text-xs text-stone-400 font-mono hidden sm:block">
              Move: <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700">W</kbd>
              <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700 ml-1">S</kbd> &middot; Turn:
              <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700 ml-1">Q</kbd>
              <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700 ml-1">E</kbd> / Arrows &middot; Shoot:
              <kbd className="bg-stone-800 px-1.5 py-0.5 rounded text-rose-300 border border-stone-700 ml-1">Space</kbd> / Click
            </div>

            <div className="flex items-center gap-1.5 mx-auto sm:mx-0">
              <button
                onClick={() => rotate(-0.15)}
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                title="Turn Left"
              >
                ↺
              </button>
              <button
                onClick={() => tryMove(1, 0)}
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                title="Move Forward"
              >
                ↑
              </button>
              <button
                onClick={() => tryMove(-1, 0)}
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                title="Move Backward"
              >
                ↓
              </button>
              <button
                onClick={() => rotate(0.15)}
                className="w-9 h-9 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold font-mono border border-stone-700 flex items-center justify-center cursor-pointer"
                title="Turn Right"
              >
                ↻
              </button>
            </div>

            <button
              onClick={shoot}
              className="text-xs font-mono px-3.5 py-2 rounded-lg bg-rose-600/30 hover:bg-rose-600/50 text-rose-200 border border-rose-500/40 cursor-pointer flex items-center gap-1.5"
            >
              <Crosshair className="h-4 w-4 text-rose-400" />
              <span>Fire Shotgun</span>
            </button>
          </div>
        </div>

        {/* Engine Pipeline Controls */}
        <div className="lg:col-span-4 space-y-4">
          <div className="rounded-xl border border-stone-800 bg-stone-950/80 p-4 space-y-4">
            <h4 className="text-xs font-mono uppercase tracking-wider text-rose-400 font-semibold flex items-center gap-2">
              <Layers className="h-4 w-4" />
              <span>3D Engine Architectural Controls</span>
            </h4>

            {/* View Mode */}
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
                  3D First-Person
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

            {/* PixelScale Button Selector */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-mono text-stone-400">
                <span>PixelScale (Render Downscaler):</span>
                <span className="text-amber-400 font-bold">{pixelScale}x Pixelation</span>
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
                    {scale}x {scale === 3 ? '(Default)' : ''}
                  </button>
                ))}
              </div>
            </div>

            {/* Depth Fog Toggle */}
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

            {/* Why This Is Tiny Callout */}
            <div className="rounded-lg border border-stone-800 bg-stone-900/60 p-3 space-y-1.5 text-xs">
              <div className="font-semibold text-stone-200 flex items-center gap-1.5">
                <Zap className="h-3.5 w-3.5 text-rose-400" />
                <span>How Kivylius Keeps Dungen Doom at 357 KB:</span>
              </div>
              <p className="text-stone-400 leading-relaxed text-[11px]">
                By combining <strong>Three.js</strong> with <strong>2.5D billboard quads</strong> (camera-facing 2D sprites) and <strong>canvas-generated wall textures</strong>, the entire 3D dungeon engine downloads in the time it takes to load one JPEG banner!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
