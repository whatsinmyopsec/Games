import { ZipFileEntry, EngineComparisonItem, CodeSnippet } from '../types';

export const TORCHBOUND_STATS = {
  version: '3.1.7',
  previousVersion: '2.9.0',
  historicalVersion: '2.2.0',
  downloadZipSizeMB: 8.9,
  officialLabelZipMB: 2.2,
  previousZipSizeMB: 13.2,
  downloadZipSizeBytes: 8877444, // 2.03 MiB (2.13 MB decimal, listed as 2.2 MB zip on page)
  gameHtmlSizeBytes: 2658057, // 2.08 MiB (1.39 MB pure JS engine + 558 KB inlined base64 MP3 SFX + 85 KB PeerJS + 58 KB TTF font)
  gameHtmlSizeMB: 2.53,
  pureEngineJsMB: 1.39,
  inlinedSfxKB: 558,
  gameHtmlGzipSizeBytes: 1115285, // 868 KB gzipped
  gameHtmlGzipKB: 1089,
  executableCompressedMB: 1.14,
  executableUncompressedMB: 2.74,
  resourcesNeuBytes: 9272700, // 2.16 MiB (2.27 MB)
  resourcesNeuCompressedBytes: 7709024, // 938.5 KB compressed
  audioFilesCount: 0, // 0 external files (all procedural Web Audio + inlined base64 strings)
  textureAtlasesCount: 0,
  dungeonGeometryFilesCount: 0,
  optimizationDropPercentage: '84% size reduction (13.2 MB → 2.1 MB)',
  lastAnalyzedUTC: '2026-10-29 05:31 UTC',
};

export const TORCHBOUND_VERSION_HISTORY = [
  {
    version: '3.0.7',
    date: 'Latest Release (Oct 2026)',
    zipSizeMB: 2.1,
    summary: 'Added 558 KB of inlined base64 MP3 CC0 enemy voices (V293_SFX) and arcade weapon sounds (V301_SFX), readable dungeon flow, 6 attack abilities, and co-op hotfixes across 12,574 lines of JS.',
    breakdown: [
      { name: 'Torchbound.exe', size: '2.74 MB (1.14 MB zipped)', desc: 'Neutralinojs runtime binary using OS Edge WebView2' },
      { name: 'resources.neu', size: '2.27 MB (939 KB zipped)', desc: '1.39 MB pure engine/art/lore JS + 558 KB base64 MP3 SFX + 85 KB PeerJS + 58 KB TTF font' },
      { name: 'README.txt', size: '491 bytes (317 B zipped)', desc: 'Installation instructions' },
    ]
  },
  {
    version: '2.9.0',
    date: 'Earlier Oct 2026 Release',
    zipSizeMB: 1.7,
    summary: 'Added Burke Gallow arena PvP duels, 3rd ability slot, and self-updating desktop manifest before base64 voice samples were inlined.',
    breakdown: [
      { name: 'Torchbound.exe', size: '2.74 MB (1.15 MB zipped)', desc: 'Neutralinojs runtime binary' },
      { name: 'resources.neu', size: '1.23 MB (480 KB zipped)', desc: 'Full game engine, HTML5 canvas, procedural sound synth, WebRTC co-op' },
    ]
  },
  {
    version: '2.5.1',
    date: 'Cutscene Optimization Release',
    zipSizeMB: 1.6,
    summary: 'Replaced the 12.3 MB external MP4 video cutscenes with a real-time in-engine rendered cutscene and original chiptune score, shrinking the zip by 88%!',
    breakdown: [
      { name: 'Torchbound.exe', size: '2.74 MB (1.15 MB zipped)', desc: 'Neutralinojs runtime binary' },
      { name: 'resources.neu', size: '1.23 MB', desc: 'Packed game assets with in-engine cutscene' },
    ]
  },
  {
    version: '2.2.0',
    date: 'Historical Baseline',
    zipSizeMB: 13.2,
    summary: 'Bundled two pre-rendered video cutscenes (intro.mp4 + intro_mobile.mp4 = 12.3 MB). Proved our case study thesis that 89% of the archive was just video!',
    breakdown: [
      { name: 'intro.mp4 & intro_mobile.mp4', size: '12.32 MB (11.75 MB zipped)', desc: 'Two opening video cutscenes (89% of zip)' },
      { name: 'Torchbound.exe', size: '2.74 MB (1.15 MB zipped)', desc: 'Neutralinojs launcher' },
      { name: 'game.html', size: '1.04 MB (312 KB zipped)', desc: 'Complete 2D RPG logic, sprites, and sound' },
    ]
  }
];

export const CURRENT_ZIP_FILE_BREAKDOWN: ZipFileEntry[] = [
  {
    path: 'Torchbound/Torchbound.exe',
    name: 'Torchbound.exe',
    sizeBytes: 2738688,
    compressedBytes: 1167613,
    category: 'executable',
    description: 'Neutralinojs native Windows launcher (1.14 MB compressed). Instantiates the pre-installed Microsoft Edge WebView2 on Windows 10/11 instead of packaging a 180MB Chromium build.',
  },
  {
    path: 'Torchbound/resources.neu',
    name: 'resources.neu',
    sizeBytes: 2269404,
    compressedBytes: 961044,
    category: 'game-core',
    description: 'THE ENTIRE GAME (938.5 KB compressed)! Contains index.html (1.39 MB pure JS engine, procedural pixel art, in-engine cutscene, quests & WebRTC co-op + 558 KB of inlined base64 MP3 CC0 voices/weapon SFX + 85 KB PeerJS + 58 KB TTF font).',
  },
  {
    path: 'Torchbound/README.txt',
    name: 'README.txt',
    sizeBytes: 491,
    compressedBytes: 317,
    category: 'config',
    description: 'Quick-start installation guide, SmartScreen run instructions, and fullscreen controls.',
  },
];

export const HISTORICAL_ZIP_FILE_BREAKDOWN: ZipFileEntry[] = [
  {
    path: 'Torchbound/resources/assets/intro.mp4',
    name: 'intro.mp4',
    sizeBytes: 7512340,
    compressedBytes: 7320000,
    category: 'video',
    description: 'High-res desktop opening cinematic video. Accounted for 54% of the entire download archive alone in v2.2.0!',
  },
  {
    path: 'Torchbound/resources/assets/intro_mobile.mp4',
    name: 'intro_mobile.mp4',
    sizeBytes: 4809043,
    compressedBytes: 4680000,
    category: 'video',
    description: 'Mobile-formatted opening cinematic video. Combined with intro.mp4, cutscenes made up 89% of the 13.2 MB zip.',
  },
  {
    path: 'Torchbound/Torchbound.exe',
    name: 'Torchbound.exe',
    sizeBytes: 2738688,
    compressedBytes: 1155235,
    category: 'executable',
    description: 'Neutralinojs native Windows launcher hooking into Edge WebView2.',
  },
  {
    path: 'Torchbound/resources/game.html',
    name: 'game.html',
    sizeBytes: 1035553,
    compressedBytes: 312000,
    category: 'game-core',
    description: 'The complete v2.2.0 2D RPG game logic, procedural audio synth, and graphics.',
  },
];

export const ZIP_FILE_BREAKDOWN = CURRENT_ZIP_FILE_BREAKDOWN;

export const PILLARS_DATA = [
  {
    id: 'runtime',
    title: 'Neutralinojs vs Electron Architecture',
    savedMegabytes: 'Saves 150–200 MB',
    tag: 'RUNTIME & PACKAGING',
    headline: 'Native WebView2 Hooking instead of Bundling Chromium',
    description: 'Standard desktop HTML5 wrappers (like Electron) bundle an entire copy of Google Chrome and Node.js. Torchbound uses Neutralinojs, which compiles to a ~1.14 MB compressed executable that commands Windows 10/11 to instantiate Microsoft Edge WebView2, which is already installed on the OS.',
    mechanics: [
      'Executes a lean C++ native wrapper (Torchbound.exe, 2.74 MB raw / 1.14 MB zipped).',
      'Packs all web assets into a single Neutralino archive (resources.neu, 2.27 MB raw / 939 KB zipped).',
      'Replaces the old 12.3 MB MP4 intro video (since v2.5.0) with a real-time in-engine cutscene and chiptune score.',
      'Enjoys full Chromium hardware acceleration and WebGL/Canvas performance with zero browser payload overhead.'
    ],
    conventionalVs: 'Electron bundles ~180 MB of Chromium binaries, audio codecs, and Node.js runtime.'
  },
  {
    id: 'audio',
    title: 'Procedural Web Audio + Inlined Base64 Micro-SFX',
    savedMegabytes: 'Saves 50–120 MB',
    tag: 'AUDIO ENGINE',
    headline: 'Synthesized Music & SFX + Zero External Audio Files',
    description: 'Torchbound ships ZERO external .wav or .mp3 files on disk. Core sounds and dungeon music are synthesized mathematically via Web Audio API oscillators, while v2.9.3 and v3.0.1 added compact CC0 enemy groans (V293_SFX, 434 KB) and weapon swings (V301_SFX, 123 KB) directly inlined as base64 strings inside index.html.',
    mechanics: [
      'Procedural Synth: Footsteps, spells, coins, and chiptune dungeon music are pure Web Audio oscillator math.',
      'V293_SFX (v2.9.3+): 434.5 KB of CC0 enemy hurt/growl recordings embedded directly as base64 MP3 arrays.',
      'V301_SFX (v3.0.1+): 123.2 KB of punchy arcade weapon/ability swing recordings embedded in JS.',
      'Zero external HTTP audio fetches or loose asset files.'
    ],
    conventionalVs: 'Typical indie RPGs package 50–150 MB of uncompressed WAV/OGG sound banks.'
  },
  {
    id: 'graphics',
    title: 'Procedural Pixel Sprites & Palette Arithmetic',
    savedMegabytes: 'Saves 30–80 MB',
    tag: 'ART PIPELINE',
    headline: 'Procedural Canvas Sprites + Visible Hero Gear Layers',
    description: 'Characters, monsters, walls, and items are painted into offscreen canvases at boot using compact pixel coordinates and dynamic color arithmetic. Even visible hero equipment (helmets, chest armor, boots, weapon glow added in v2.4.0) is composited algorithmically.',
    mechanics: [
      'Sprites, tiles, icons, and lights are generated in ~330 lines of procedural pixel art code.',
      'Only 2 tiny data:image/png icons (4.2 KB total) and 1 embedded TTF font (52.2 KB) exist in the HTML.',
      'Dynamic color mixing (hexRGB and shade) generates monster variants and masonry mortar seams with zero PNG atlases.',
      'Result: Complete visual variety across dungeons, towns, and interiors with 0 external texture files.'
    ],
    conventionalVs: 'Standard 2D engines package multiple 2048x2048 PNG texture atlases and sprite sheets.'
  },
  {
    id: 'dungeon',
    title: 'Infinite Procedural Dungeons & Readable Flow',
    savedMegabytes: 'Saves 15–40 MB',
    tag: 'LEVEL DESIGN',
    headline: 'Deterministic PRNG Carving Rooms, Traps & Boss Gates',
    description: 'There are no pre-baked tilemap JSON files or TMX maps. Dungeons, illusory walls, trap levers, mini-bosses, and town interiors are generated in memory (upgraded in v3.0.3 for readable dungeon flow) and synchronized across co-op peers via WebRTC.',
    mechanics: [
      'Carves dungeon rooms, corridors, illusory walls, and boss arenas algorithmically in RAM.',
      'Includes embedded PeerJS 1.5.5 (84.9 KB) for host-authoritative WebRTC peer-to-peer online co-op.',
      'All lore text, town dialogue trees, side quests, and PvP arena logic live inside 12,574 lines of readable JS.'
    ],
    conventionalVs: 'Traditional games ship 20MB to 100MB of pre-baked level geometry and tilemap data.'
  },
  {
    id: 'lighting',
    title: 'Canvas2D Darkness Masking (destination-out)',
    savedMegabytes: 'Saves 10–25 MB',
    tag: 'GRAPHICS SHADERS',
    headline: 'Radial Gradients Punching Holes in Darkness',
    description: 'Torchbound creates its moody dungeon atmosphere and fog of war without 3D normal maps or heavy shader compilation pipelines. It paints a darkness overlay on an HTML5 canvas and uses destination-out blend modes to punch out flickering torchlight cones.',
    mechanics: [
      'Draws dungeon darkness and fog-of-war overlay.',
      'Sets ctx.globalCompositeOperation = "destination-out".',
      'Draws radial gradient around player torch with sine-wave flicker modulation.',
      'Punches crisp light circles for wall sconces, spectral wraith orbs, and weapon glow with zero GPU shader overhead.'
    ],
    conventionalVs: 'Modern engines compile complex 2D shadow caster shaders, normal lightmaps, and blur passes.'
  }
];

export const ENGINE_COMPARISONS: EngineComparisonItem[] = [
  {
    name: 'Torchbound v3.0.7 (Neutralinojs)',
    sizeMB: 2.1,
    runtimeType: 'C++ Native + Edge WebView2',
    bundledChromium: false,
    builtInAudioFormat: 'Web Audio Synth + 558KB Base64 MP3',
    torchboundEquivalentSize: '2.1 MB (Windows Zip)',
    pros: 'Ultra-lean 2.1 MB download (1.14 MB exe + 939 KB resources.neu), instant launch, native window controls, zero Node.js overhead.',
    cons: 'Requires Windows 10/11 with Edge WebView2 installed (comes pre-installed by default).'
  },
  {
    name: 'Electron (Standard Desktop Web)',
    sizeMB: 185.0,
    runtimeType: 'Full Chromium + Node.js Binary',
    bundledChromium: true,
    builtInAudioFormat: 'Sampled MP3/OGG (40-80 MB)',
    torchboundEquivalentSize: '185 MB minimum',
    pros: 'Guaranteed consistent Chromium version across all platforms, extensive Node.js native API access.',
    cons: 'Massive binary bloat (+150MB overhead before game assets), high RAM consumption (250MB+ idle).'
  },
  {
    name: 'Unity 2D Standalone',
    sizeMB: 110.0,
    runtimeType: 'Mono / IL2CPP C# Engine',
    bundledChromium: false,
    builtInAudioFormat: 'FMOD / Unity Audio Bank (50 MB)',
    torchboundEquivalentSize: '110 MB minimum',
    pros: 'Rich visual editor, extensive asset store, multi-platform deployment.',
    cons: 'Heavy runtime overhead, C# runtime libraries, complex asset serialization.'
  },
  {
    name: 'Godot 4 Standalone',
    sizeMB: 48.0,
    runtimeType: 'C++ Lightweight Engine',
    bundledChromium: false,
    builtInAudioFormat: 'WAV / OGG samples (30 MB)',
    torchboundEquivalentSize: '48 MB minimum',
    pros: 'Much leaner than Unity, open source, dedicated 2D node pipeline.',
    cons: 'Still bundles 40MB+ engine binary compared to Neutralino’s 1.14MB.'
  },
  {
    name: 'Unreal Engine 5 (Paper2D)',
    sizeMB: 380.0,
    runtimeType: 'C++ Heavyweight Engine',
    bundledChromium: false,
    builtInAudioFormat: 'MetaSound Audio Banks (80 MB)',
    torchboundEquivalentSize: '380 MB minimum',
    pros: 'Industry-standard graphics, blueprints, nanite/lumen capabilities.',
    cons: 'Extremely heavy for 2D games; huge base binary footprint.'
  }
];

export const CODE_SNIPPETS: CodeSnippet[] = [
  {
    id: 'mulberry32',
    title: 'Deterministic Mulberry32 PRNG (Level Generator)',
    category: 'ProcGen',
    savedMegabytes: 'Saves 25 MB of Level JSONs',
    code: `// Deterministic 32-bit PRNG carves identical dungeons across multiplayer peers
function mulberry32(seed) {
  return function() {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Generate coordinate hash for endless dungeon rooms
function hash2(x, y, seed) {
  const n = Math.sin(x * 12.9898 + y * 78.233 + seed) * 43758.5453;
  return n - Math.floor(n);
}`,
    explanation: [
      'Replaces multi-megabyte tilemap files with 15 lines of pure mathematical code.',
      'Peers in multiplayer co-op pass only an integer seed over WebRTC DataChannels.',
      'Both players generate the exact same room layouts, traps, and boss spawns locally.'
    ]
  },
  {
    id: 'audio-synth',
    title: 'Web Audio Procedural Sound Synthesis + Base64 SFX',
    category: 'Audio',
    savedMegabytes: 'Saves 80 MB of Audio Samples',
    code: `// 1. Procedural Web Audio synthesis for core SFX & sequenced music
function playSwordSlash(audioCtx) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(750, audioCtx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.12);

  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(3200, audioCtx.currentTime);
  filter.frequency.linearRampToValueAtTime(400, audioCtx.currentTime + 0.12);

  gain.gain.setValueAtTime(0.3, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.12);

  osc.connect(filter).connect(gain).connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + 0.12);
}

// 2. Added in v2.9.3 & v3.0.1: Inlined base64 MP3 arrays (558 KB total)
const V293_SFX = { "zomb_hurt": ["SUQzBAAAAAAA..."] }; // 434.5 KB
const V301_SFX = { "swing": ["SUQzBAAAAAAAIlRT..."] }; // 123.2 KB`,
    explanation: [
      'Generates core sound effects and dungeon music directly from mathematical formulas.',
      'In v2.9.3 and v3.0.1, added 558 KB of base64-encoded MP3 enemy voices and weapon swings directly inside index.html.',
      'Still ships zero external audio files and compresses down to 868 KB gzipped for the entire 2.08 MB HTML file.'
    ]
  },
  {
    id: 'lighting-mask',
    title: 'Canvas 2D Darkness Punching (destination-out)',
    category: 'Lighting',
    savedMegabytes: 'Saves 15 MB Shader Pipelines',
    code: `// Render torchlight flicker with zero GPU shader packages
function renderLighting(ctx, width, height, player, tick) {
  // 1. Paint pitch black dungeon darkness over the screen
  ctx.fillStyle = 'rgba(7, 5, 12, 0.94)';
  ctx.fillRect(0, 0, width, height);

  // 2. Punch holes in darkness using destination-out blend mode
  ctx.globalCompositeOperation = 'destination-out';

  // 3. Flame flicker formula: sin wave modulation
  const flicker = Math.sin(tick * 0.1) * 3 + Math.cos(tick * 0.07) * 2;
  const radius = player.torchRadius + flicker;

  const grad = ctx.createRadialGradient(
    player.x, player.y, 10,
    player.x, player.y, radius
  );
  grad.addColorStop(0, 'rgba(0, 0, 0, 1)');
  grad.addColorStop(0.6, 'rgba(0, 0, 0, 0.85)');
  grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.arc(player.x, player.y, radius, 0, Math.PI * 2);
  ctx.fill();

  // Reset composite operation for normal UI rendering
  ctx.globalCompositeOperation = 'source-over';
}`,
    explanation: [
      'Utilizes native 2D canvas blend modes to punch out light cones.',
      'Sine and cosine wave combinations emulate organic torch fire flickering.',
      'Eliminates need for heavy normal maps, shadow caster libraries, or custom WebGL shaders.'
    ]
  },
  {
    id: 'neutralino-config',
    title: 'Neutralinojs Desktop Configuration (resources.neu)',
    category: 'Packaging',
    savedMegabytes: 'Saves 180 MB Electron Overhead',
    code: `{
  "applicationId": "com.torchbound.game",
  "version": "3.0.7",
  "defaultMode": "window",
  "port": 0,
  "url": "/index.html",
  "enableServer": true,
  "enableNativeAPI": true,
  "modes": {
    "window": {
      "title": "Torchbound",
      "width": 1280,
      "height": 720,
      "minWidth": 800,
      "minHeight": 600,
      "fullScreen": false
    }
  }
}`,
    explanation: [
      'Zero Chromium bundling: neutralino.config.json tells Windows to instantiate the native Edge WebView2 control.',
      'Bundles the entire 2.08 MB index.html, icons, and manifest into resources.neu (938.5 KB compressed in zip).',
      'Combined with Torchbound.exe (1.14 MB compressed), the entire Windows zip is 2,129,462 bytes (~2.1 MB).'
    ]
  }
];
