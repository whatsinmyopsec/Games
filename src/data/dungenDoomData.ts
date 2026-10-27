export interface DungenDoomAsset {
  name: string;
  category: 'threejs' | 'engine' | 'textures' | 'audio-code' | 'css';
  rawSizeBytes: number;
  gzipSizeBytes: number;
  description: string;
}

export const DUNGEN_DOOM_STATS = {
  title: 'Dungen Doom',
  developer: 'Kivylius',
  url: 'https://kivylius.com/games/dungen-doom/',
  bundleName: 'index-CbAtqd8W.js',
  cssName: 'index-oEHxUlVk.css',
  htmlSizeBytes: 409,
  bundleSizeBytes: 1505395, // 1.44 MB
  bundleSizeMB: 1.44,
  bundleGzipBytes: 431639, // 421.5 KB (~422 KB)
  bundleGzipKB: 422,
  cssSizeBytes: 151000, // 147.5 KB
  cssGzipBytes: 46421, // 45.3 KB
  totalTransferKB: 467,
  external3DModelsCount: 0,
  proceduralTextureCount: 55,
  pixelScale: 3,
  fov: 78,
  lastAnalyzedUTC: '2026-10-27 04:47 UTC',
};

export const DUNGEN_DOOM_BREAKDOWN: DungenDoomAsset[] = [
  {
    name: 'Three.js 3D Core & WebGL Renderer',
    category: 'threejs',
    rawSizeBytes: 680000,
    gzipSizeBytes: 182000,
    description: 'Stripped Three.js runtime: PerspectiveCamera, WebGLRenderer, BoxGeometry, PlaneGeometry, Vector/Matrix math. Zero 3D engine overhead beyond pure WebGL.',
  },
  {
    name: 'Dungeon Generation, Traps & Enemy AI Loop',
    category: 'engine',
    rawSizeBytes: 495000,
    gzipSizeBytes: 142000,
    description: 'Carves 3D dungeon corridors, wall colliders, doors, stairs, spike rows, poison traps, and Imp/Demon/Spider AI state machines in memory.',
  },
  {
    name: '55 Procedural CanvasTexture Generators (yt() & F0())',
    category: 'textures',
    rawSizeBytes: 235000,
    gzipSizeBytes: 76000,
    description: 'Generates stone walls, crates, barricades, sacks, banners, torches, rugs, and poison/acid fumes into HTML5 canvases at startup.',
  },
  {
    name: 'Web Audio Decode Pipeline & Sfx System',
    category: 'audio-code',
    rawSizeBytes: 95395,
    gzipSizeBytes: 31639,
    description: 'Audio manager that decodes 81 ultra-compact Kenney & FilmCow micro-samples (1-4 KB each) on-demand using AudioContext.decodeAudioData.',
  },
  {
    name: 'UI Stylesheet (index-oEHxUlVk.css)',
    category: 'css',
    rawSizeBytes: 151000,
    gzipSizeBytes: 46421,
    description: 'Retro HUD layout, weapon display, health/armor gauges, and responsive canvas viewport scaling.',
  },
];

export const DUNGEN_DOOM_PILLARS = [
  {
    id: 'canvas-textures',
    title: '55 Procedural CanvasTextures (Zero Texture Atlases)',
    savedMegabytes: 'Saves 40–120 MB',
    tag: 'GRAPHICS & MEMORY',
    headline: 'Painting 3D Wall & Prop Materials Inside Offscreen 2D Canvases',
    description: 'Instead of loading megabytes of PNG texture packs for stone walls, iron doors, torches, spike traps, and wooden crates, Dungen Doom paints 55 distinct materials procedurally on startup.',
    mechanics: [
      'The function yt("tex.name", () => canvasElement) creates a new THREE.CanvasTexture directly from code.',
      'Uses compact hex color palettes: copper (#c07040, #7a4020, #e8a070), stone (#3e3a48), and planks.',
      'Applies nearest-neighbor texture filtering (THREE.NearestFilter) so low-resolution procedural 32x32 canvases look razor-sharp in retro 90s style.',
      'Result: High visual variety across 55 texture keys with only 6 small hub background sprites.'
    ],
    conventionalVs: 'Standard 3D games download 50MB to 2GB of baked PNG/DDS textures and normal maps.'
  },
  {
    id: 'billboarding',
    title: 'Doom-Style 2.5D Billboard Sprites',
    savedMegabytes: 'Saves 80–250 MB',
    tag: '3D PIPELINE',
    headline: 'Zero 3D Character Models: Flat Sprites in 3D Perspective',
    description: 'Just like the original 1993 DOOM and Daggerfall, enemies, torches, and items are flat 2D sprite quads that automatically rotate to face the camera.',
    mechanics: [
      'Uses THREE.Sprite (or PlaneGeometry quads with uprightSprites: true).',
      'Eliminates skeletal rigs, bone weights, vertex animations, and high-polygon 3D meshes.',
      'Enemies like Imps, Skeletons, Demons, and Spiders are simple sprite frames drawn onto quads with alphaTest: 0.5.',
      'Saves hundreds of megabytes in 3D animation clips and FBX/GLTF model files.'
    ],
    conventionalVs: 'A single 3D rigged demon model with animations in Unity/Unreal weighs 15–40 MB.'
  },
  {
    id: 'depth-fog',
    title: 'PixelScale & Depth Fog Atmosphere',
    savedMegabytes: 'Saves 25–60 MB',
    tag: 'ATMOSPHERE & SHADERS',
    headline: 'Low-Res Pixel Scaling + Linear Fog Instead of Heavy Post-Processing',
    description: 'Modern 3D games use complex raymarched ambient occlusion, volumetric fog, and heavy post-processing stacks. Dungen Doom creates its claustrophobic atmosphere with two simple WebGL parameters.',
    mechanics: [
      'pixelScale: 3 downscales the internal WebGL render buffer, giving authentic 320x200 retro aesthetic while running at blistering 60+ FPS on any low-end GPU.',
      'Linear Depth Fog (fogNear: 3, fogFar: 34) fades distant dungeon corridors into pitch black.',
      'Lantern and torch light are lightweight point lights with inverse-square attenuation, avoiding costly deferred shadow maps.'
    ],
    conventionalVs: 'Modern games bundle volumetric fog shaders and post-processing packages that take 30MB+ and require discrete GPUs.'
  },
  {
    id: 'micro-audio',
    title: 'Micro-OGG On-Demand Audio Streaming',
    savedMegabytes: 'Saves 30–80 MB',
    tag: 'AUDIO ARCHITECTURE',
    headline: 'Kenney 1–4 KB Sound Clips Decoded Directly via Web Audio',
    description: 'While Torchbound uses Web Audio synthesis plus inlined base64 SFX, Dungen Doom uses ultra-short 1KB–4KB OGG/WAV micro-samples loaded asynchronously on-demand.',
    mechanics: [
      '81 sound effect references pulled from public-domain micro-libraries (Kenney, FilmCow) where each file is just 1.5 KB to 4 KB.',
      'Files are fetched via fetch("audio/" + file) and decoded into native Web Audio memory buffers using AudioContext.decodeAudioData().',
      'The initial page load requires 0 audio downloads; sounds stream in the background only when triggered.',
      'Total memory footprint of all sound effects combined is under 200 KB!'
    ],
    conventionalVs: 'Standard game builds pre-bundle 50–150 MB of uncompressed audio banks.'
  }
];

export const COMPARISON_TABLE = [
  {
    dimension: 'Core Genre',
    torchbound: '2D Top-Down Co-op Dungeon Crawler (v3.0.7)',
    dungenDoom: '3D First-Person Retro FPS Dungeon Crawler',
  },
  {
    dimension: 'Initial Network Transfer',
    torchbound: '868 KB gzipped (2.08 MB index.html with inlined SFX)',
    dungenDoom: '422 KB gzipped (1.44 MB index-CbAtqd8W.js bundle)',
  },
  {
    dimension: 'Rendering Technology',
    torchbound: 'HTML5 Canvas 2D + destination-out blend modes',
    dungenDoom: 'Three.js WebGL + 2.5D Billboard Sprites',
  },
  {
    dimension: 'Texture & Art Pipeline',
    torchbound: 'Procedural pixel art + dynamic color mixing',
    dungenDoom: '55 Procedural CanvasTextures generated in offscreen canvases',
  },
  {
    dimension: '3D Geometry Files',
    torchbound: 'None (2D orthogonal grid)',
    dungenDoom: '0 bytes (box & plane primitives generated in code)',
  },
  {
    dimension: 'Audio Pipeline',
    torchbound: 'Procedural Web Audio synth + 558 KB inlined Base64 MP3s',
    dungenDoom: 'On-demand 2KB Kenney micro-OGGs + Web Audio decoder',
  },
  {
    dimension: 'Atmospheric Lighting',
    torchbound: 'Radial gradients cutting holes in darkness mask',
    dungenDoom: 'Linear depth fog (3–34m) + lantern point lights',
  },
  {
    dimension: 'Desktop Packaging',
    torchbound: 'Neutralinojs + Microsoft Edge WebView2 (2.1 MB zip)',
    dungenDoom: 'Direct Web App (installs via browser with 0 MB overhead)',
  },
];
